
const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');

const workbook2 = XLSX.readFile('ListadoLuis.xlsx');
const sheet_name_list2 = workbook2.SheetNames;
let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["VatS_status"]);



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

// get list from folder function
let getList = (path) =>  fs.readdirAsync( path );


const CPA = getList('C:\\Users\\Escobar\\Desktop\\documentsB\\CPAs');
// const DoT = getList('H:\\USER\\Jobstudents\\DoTs\\DoT_2sig_Stamped'); //Not included for now
const DoTo = getList('C:\\Users\\Escobar\\Desktop\\documentsB\\DoT');

Promise.all([CPA, DoTo]).then( values =>{
    const destination = 'C:\\Users\\Escobar\\Desktop\\Assig';

    let numbered = xlData2.filter(x => x.hasOwnProperty('company_name'));
    console.log(numbered.length);
    numbered.forEach(i => {
         //Folder structure name
         const savePath = `${destination}/${i.company_name} - ${i.Ident}`; //${i['Assigner_Number_writ ']} -
        
         //Extracts Id number
         let tempId = (id) =>{
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
 
         const extractId = tempId(i.Ident.trim());
        
        console.log(savePath);
        if (!fs.existsSync(savePath)){
            fs.mkdirSync(savePath);
        }
        

         values[0].forEach(d => {
            if (d.includes(extractId)) {
                // fs.copy('H:\\USER\\Jobstudents\\CPAs' + '/' + d, `${savePath}/${d}`, { replace: false }); 
                fs.copy('C:\\Users\\Escobar\\Desktop\\documentsB\\CPAs' + '\\' + d, `${savePath}/${d}`, { replace: false }); 
            }           
        })

        // DOT
        values[1].forEach(d => {
            if (d.includes(extractId)) {
                // fs.copy('H:\\USER\\Jobstudents\\DoTs\\DoT_2sig_Stamped' + '/' + d, `${savePath}/${d}`, { replace: false });
                fs.copy('C:\\Users\\Escobar\\Desktop\\documentsB\\DoT' + '\\' + d, `${savePath}/${d}`, { replace: false });
            }
        })


    });
});