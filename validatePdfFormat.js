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
let getList = (pathList) =>  fs.readdirAsync( pathList );

const powers = getList('C:\\Users\\Escobar\\Desktop\\convertedFiles\\power');



let ocrList = [];
let pdfAList = [];

//Callback function to add documenta to the OCR list
let addOCR = (document, value) => {
    ocrList.push({
        Document: document,
        OCR: value
    });
}
let count = 0;
Promise.all([powers]).then( values =>{

     // For each power
     values[0].forEach((d) => {
        let pathDoc = `C:\\Users\\Escobar\\Desktop\\convertedFiles\\power\\${d}`;
        //save PDF/A
        if (d != 'Thumbs.db') {
        //     let res = getMetadata.getPDFAMetadata(pathDoc);
        //     res.then(x => {pdfAList.push({
        //             Document: d,
        //             PDFA: x
        //         });
        //         count ++;
        //         if (count == values[0].length - 1){
        //             let data =   json2xls(pdfAList);
        //             fs.writeFileSync('pdfaList.xlsx', data, 'binary');
        //         }
        // });
            getText.containText(pathDoc, addOCR);
        }
        
        //getText.containText(pathDoc, addOCR);

    })

    
    // console.log('list2', ocrList);

});
