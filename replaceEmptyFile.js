

const path = require('path');
const fs = require('fs.extra');

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

const folderPath = 'C:\\Users\\Escobar\\Desktop\\newList2\\';

const assignorsList = getList(folderPath);

Promise.all([assignorsList]).then(result =>{
    console.log('these are the results', result);
});