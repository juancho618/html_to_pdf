const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const getMetadata = require('./getMetadataPDF');
const getText = require('./getText.js');

fs.readdirAsync = dirname => {
    return new Promise(function (resolve, reject) {
        fs.readdir(dirname, function (err, filenames) {
            if (err)
                reject(err);
            else
                resolve(filenames);
        });
    });
};

// get list from folder function
let getList = (pathList) => fs.readdirAsync(pathList);

const powers = getList('C:\\Users\\Escobar\\Desktop\\powersList');



let ocrList = [];
let pdfAList = [];


let count = 0;
let count2 = 0;
Promise.all([powers]).then(values => {

    // For each power
    values[0].forEach((d) => {
        let pathDoc = `C:\\Users\\Escobar\\Desktop\\powersList\\${d}`;
        //save PDF/A
        if (d != 'Thumbs.db') {
            // Get the metadata from the Pdf File
            let hasMetadata = getMetadata.getPDFAMetadata(pathDoc);
            let isOcr = getText.pdfToText(pathDoc);

            // for the metadata
            hasMetadata.then(x => {
                pdfAList.push({
                    Document: d,
                    PDFA: x
                });
                count++;
                if (count == values[0].length - 1) {
                    let data = json2xls(pdfAList);
                    fs.writeFileSync('pdfaList.xlsx', data, 'binary');
                }

                // for the OCR files
                isOcr.then(ocr => {
                    ocrList.push({
                        Document: d,
                        OCR: ocr
                    });
                    count2++;
                    if (count2 == values[0].length - 1) {
                        let data = json2xls(ocrList);
                        fs.writeFileSync('ocrList.xlsx', data, 'binary');
                    }
                })
            });
        }
    })
});
