const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');

//OCR review documents list,
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

const savePath = `C:\\Users\\Escobar\\Desktop\\Others`;
let getList = (path) =>  fs.readdirAsync( path );

const others = getList('C:\\Users\\Escobar\\Desktop\\Others');

others.then(documents => {

    documents.map(document => {
        if (document.includes('CPA')){
            if (!fs.existsSync(`${savePath}\\CPA`)){
                fs.mkdirSync(`${savePath}\\CPA`);           
            }
            fs.copy(`C:\\Users\\Escobar\\Desktop\\Others\\${document}`, `${savePath}\\CPA\\${document}`, { replace: false });
        } else if (document.includes('powers')){
            if (!fs.existsSync(`${savePath}\\powers`)){
                fs.mkdirSync(`${savePath}\\powers`);           
            }
            fs.copy(`C:\\Users\\Escobar\\Desktop\\Others\\${document}`, `${savePath}\\powers\\${document}`, { replace: false });
        }
    });
});
// const nonOCR =  xlData.filter(doc => doc.OCR == 'FALSE');

// //County Regex
// const reLetters = new RegExp(/[A-Z]{2}_/);

// nonOCR.forEach(doc => {
//     //GET the ISO notation of the country
//     const country = reLetters.exec(doc.Document);
//     console.log('country',country);
//     if (country){
//         //Creates the folder if does not exist
//         if (!fs.existsSync(`${savePath}\\${country}`)){
//             fs.mkdirSync(`${savePath}\\${country}`);           
//         }
//         fs.copy(`C:\\Users\\Escobar\\Desktop\\cpaList\\${doc.Document}`, `${savePath}\\${country}\\${doc.Document}`, { replace: false });
//     } else {
        
//         if (!fs.existsSync(`${savePath}\\notDefined}`)){
//             fs.mkdirSync(`${savePath}\\notDefined`);           
//         }
//         fs.copy(`C:\\Users\\Escobar\\Desktop\\cpaList\\${doc.Document}`, `${savePath}\\notDefined\\${doc.Document}`, { replace: false });
//     }
// });
// console.log('count', nonOCR.length);


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

