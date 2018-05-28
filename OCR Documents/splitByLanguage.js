const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const countriesCode = require('./countries.js');

//OCR review documents list,
const workbook = XLSX.readFile('../ocrListCPA.xlsx');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet 1"]);

const documentType = "CPA's";
const savePath = `C:\\Users\\Escobar\\Desktop\\${documentType}`;
if (!fs.existsSync(`${savePath}`)){
    fs.mkdirSync(`${savePath}`);
};

const nonOCR =  xlData.filter(doc => doc.OCR == 'FALSE');

//County Regex
const reLetters = new RegExp(/[A-Z]{2}_/);

nonOCR.forEach(doc => {
    //GET the ISO notation of the country
    const country = reLetters.exec(doc.Document);
    console.log('country',country);
    if (country){
        //Creates the folder if does not exist
        if (!fs.existsSync(`${savePath}\\${country}`)){
            fs.mkdirSync(`${savePath}\\${country}`);           
        }
        fs.copy(`C:\\Users\\Escobar\\Desktop\\cpaList\\${doc.Document}`, `${savePath}\\${country}\\${doc.Document}`, { replace: false });
    } else {
        
        if (!fs.existsSync(`${savePath}\\notDefined}`)){
            fs.mkdirSync(`${savePath}\\notDefined`);           
        }
        console.log('document',doc.Document);
        fs.copy(`C:\\Users\\Escobar\\Desktop\\cpaList\\${doc.Document}`, `${savePath}\\notdefined\\${doc.Document}`, { replace: false });
    }
});
console.log('count', nonOCR.length);


// //console.log('countries', countriesCode.countries);
// fs.readdirAsync = dirname => {
//     return new Promise(function (resolve, reject) {
//         fs.readdir(dirname, function (err, filenames) {
//             if (err)
//                 reject(err);
//             else
//                 resolve(filenames);
//         });
//     });
// };

// // get list from folder function
// let getList = (pathList) => fs.readdirAsync(pathList);

