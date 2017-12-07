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
        let localList = getList('H:\\USER\\Jobstudents\\DocumentsList\\' + r);
        let sftpList = getList('H:\\USER\\Jobstudents\\DocumentsList\\' + r); // TODO: modify this address!
        Promise.all([localList, sftpList]).then(res =>{
            res[0].forEach(d => {
                if (!res[1].includes(d)){
                    console.log(`one document is not in the SFTP ${d} for the folder ${r}`);
                }
            })
        })
    })
});