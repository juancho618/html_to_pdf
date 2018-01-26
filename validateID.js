const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const workbook = XLSX.readFile('trucks contracts matrix (mail merge source).xlsm');
const sheet_name_list = workbook.SheetNames;


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

// const powers = getList('H:\\USER\\Jobstudents\\powersList');
const powers = getList('H:\\USER\\Jobstudents\\DoTs\\Dot_o_Stamped');


Promise.all([powers]).then( values =>{
    let wrongList = [];

    values[0].forEach(power => {
        const reLetters = new RegExp('[a-zA-Z]{2}_');

        if(!reLetters.exec(power)){
            wrongList.push({powerName: power});
            console.log(power);
        }
    });

    console.log(wrongList.length);
    /* create sheet data & add to workbook for the json file */
    let datam =   json2xls(wrongList);
    fs.writeFileSync('wrongPowerNaming.xlsx', datam, 'binary');
    
});