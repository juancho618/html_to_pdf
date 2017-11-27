const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');



const workbook = XLSX.readFile('trucks contracts matrix (mail merge source).xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

// async fs function
fs.readdirAsync = dirname => {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};

let numbered = xlData.filter(x => x.hasOwnProperty('Assigner_Number_writ'));

// get list from folder function
let getList = (path) =>  fs.readdirAsync( path );

const assignorsList = getList('H:\\USER\\Jobstudents\\DocumentsList')

let getIdNumber = (id) =>{
    
    const reLetters = new RegExp('^[a-zA-Z]{2}');

    if (reLetters.exec(id)){ // if it starts with two letters
        if (id.includes('_')){
            return id.slice(3);
        } else {
            return id.slice(2);
        }
    }
    return id;

};


Promise.all([assignorsList]).then(result =>{
    let listItems = []; 
    result[0].forEach( (r, index) => {
       return  getList('H:\\USER\\Jobstudents\\DocumentsList\\' + r).then( documents => {
            const rawId = r.split('-');
            const idExtract = rawId.length > 3 ? rawId[rawId.length - 1].trim() : rawId[2].trim();
            const idNumber = getIdNumber(idExtract);

            let item = {
                id: idNumber,
                power: false,
                DoT: false,
                CPA: false, 
                idType: '',
                name: ''
            }

            documents.forEach(d => {
                if(d.includes('CPA')){
                    item.CPA = true;
                }else if(d.includes('DoT')){
                    item.DoT = true;
                }else if(d.includes('power')){
                    item.power = true;
                }
            })   
            listItems.push(item);   
            if (index === result[0].length - 1) {                
                getItems(listItems); // return the data
            }
        })
       
    });
})

let getItems = (list) => {
    list.map( assignor =>{
        numbered.forEach(data => {
            if(data.Ident.includes(assignor.id)){
                assignor.idType = data.Ident_type;
                assignor.name = data.company_name;
            }
        })
    })
   

    /* create sheet data & add to workbook for the json file */
    let data =   json2xls(list);
    fs.writeFileSync('data.xlsx', data, 'binary');
};