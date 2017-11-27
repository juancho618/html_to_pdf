const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');


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

const assignorsList = getList('H:\\USER\\Jobstudents\\DocumentsList');

Promise.all([assignorsList]).then(result =>{
    result[0].forEach( (r, index) => { // for each folder in the documents
        return  getList('H:\\USER\\Jobstudents\\DocumentsList\\' + r).then( documents => { //get all the documets per assignor
            let count = 0;            
            documents.forEach(d => {
                if(d.includes('power')){
                    count ++;
                }
            })
            if (documents.length > 3){
                console.log('more than expected' + r);
            }
            if (count > 1) {
                console.log('more than expected' + r);
            }
        })
    })
});