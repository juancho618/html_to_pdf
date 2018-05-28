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

 //Extracts Id number exluding the underscore and the first two letters!
 let tempId = (document) =>{
    const reLetters = new RegExp(/[A-Z]{2}_[A-Za-z0-9]{6}/);
    const result = reLetters.exec(document);
    if (result){
        return result[0];
    } else {
        return null;
    }
    
};

//get list from folder function
let getList = (path) =>  fs.readdirAsync( path );

const documentsList = getList('H:\\USER\\Jobstudents\\Trucks\\CPAs');

documentsList.then(list =>{
    list.map( doc => {
    const id = tempId(doc);
    const matchDocuments = list.filter(docName => docName.includes(id));
   
    if (matchDocuments.length == 2){
        console.log(matchDocuments);
        const toBeDeleted =  matchDocuments.filter(d => d.includes(','));
        
        // if (toBeDeleted.length == 1){
        //     if (fs.existsSync(`H:\\USER\\Jobstudents\\Trucks\\CPAs\\${toBeDeleted[0]}`)){
        //         fs.unlink(`H:\\USER\\Jobstudents\\Trucks\\CPAs\\${toBeDeleted[0]}`)
        //     }            
        // }

    }
    })

});