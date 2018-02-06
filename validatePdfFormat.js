const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const getMetadata =  require('./getMetadataPDF');
const getText = require('./getTxtPDF');

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

const powers = getList('H:\\USER\\Jobstudents\\convertedFiles\\power');

const res = getMetadata.getPDFAMetadata('./Albert Frei,IT_00373790211_DoT_EN_o_stamped.pdf');
res.then(x => console.log(x));
console.log(getText.containText('./HR-Auszug_Bertschi Italia_VISURA.pdf'));
// Promise.all([powers]).then( values =>{

//      // For each power
//      values[0].forEach(d => {
        
//     })

// });
