const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');

const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);


// Require library
var xl = require('excel4node');
// Create a new instance of a Workbook class
var wb = new xl.Workbook();
 
// Add Worksheets to the workbook
var ws = wb.addWorksheet('Sheet 1');

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

const DOT = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\Dot_o_Stamped'); 

Promise.all([DOT]).then( val => {
    console.log(val);
    let row = 2;
    let matrix = xlData.filter(x => x.hasOwnProperty('company_name'));

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

   
    
    
    val[0].forEach( file => {

        let id = file.substr(file.indexOf(",") + 1, 11);
        const extractId = tempId(id.trim());

        ws.cell(row,1).string(file).style({font: {size: 14}});
        matrix.forEach(company => {
            let compId = company.Ident.trim();

            if (compId.includes(extractId)){
                ws.cell(row,2).string(compId).style({font: {size: 14}});
                ws.cell(row,3).string(company.company_name).style({font: {size: 14}});
                if (company['Came_in_via'])
                    ws.cell(row,4).string(company['Came_in_via']).style({font: {size: 14}});
            }           
            
        })
        row += 1;
        
    });
    wb.write('dot_list.xlsx');
})