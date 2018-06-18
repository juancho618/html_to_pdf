

const path = require('path');
const fs = require('fs.extra');
const fsSync = require("fs");
const { COPYFILE_FICLONE_FORCE } = fsSync.constants;
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

const folderPath = 'H:/USER/Jobstudents/Trucks/Submission List';

const assignorsList = getList(folderPath);
let count = 0;
Promise.all([assignorsList]).then(result =>{
    let assigCountList = [];
    result[0].map(assignorFolder => {
        const internalDocuments = getList(`${folderPath}/${assignorFolder}`);
        let assignorObject = {
            'name':assignorFolder,
             'powersCount':'',
             'cpaCount':'',
             'dotCount':'',
        }
        internalDocuments.then(docs => {
            let powersCount = 0;
            let cpaCount = 0;
            let dotCount = 0;
            let pre_assigCount = 0;
            let promList = [];
            docs.forEach(doc => {

                //Count ocurrences of documents in the folder
                if (doc.toUpperCase().includes('POWER')) {
                   powersCount ++;
                }
                else if (doc.toUpperCase().includes('DOT')) {
                    dotCount ++;
                }
                else if (doc.toUpperCase().includes('CPA')) {
                    cpaCount ++;
                } else if (doc.toUpperCase().includes('PRE_ASSIG')) {
                    pre_assigCount ++;
                }

                const fileSize = fsSync.statSync(`${folderPath}/${assignorFolder}/${doc}`).size;
                // console.log('size', fileSize); 
                
                //if the current document is empty or has no size
                if (fileSize <= 0){
                    count ++;
                    // if (doc.includes('power') ){
                    //     // promList.push(fs.copy(`H:/USER/Jobstudents/Trucks/powersList/"${doc}"`, `${folderPath}/${assignorFolder}/${doc}`, {replace: true}, (err) => {
                    //     //     if (err) throw err;
                    //     //     console.log(`${doc}was copied`);
                    //     // }));
                    //     promList.push(fs.unlink(`${folderPath}/${assignorFolder}/${doc}`, (err) => {
                    //         if (err) throw err;
                    //         console.log(`${doc} was deleted`);
                    //         //return fs.copy(`H:/USER/Jobstudents/Trucks/powersList/"${doc}"`, `${folderPath}/${assignorFolder}/${doc}`, {replace: true});
                    //       }));
                    // } 
                    // else if(doc.includes('DoT')){
                    //     promList.push(fs.unlink(  `${folderPath}/${assignorFolder}/${doc}`,  (err) => {
                    //         if (err) throw err;
                    //         console.log(`${doc}was deleted`);
                    //     }));
                    // }
                    //  else if (doc.includes('CPA')){
                    //     promList.push(fs.unlink( `${folderPath}/${assignorFolder}/${doc}`, (err) => {
                    //         if (err) throw err;
                    //         console.log(`${doc}was deleted`);
                    //     }));
                    // } else if(doc.includes('pre_assig')) {
                    //     promList.push(fs.unlink(`${folderPath}/${assignorFolder}/${doc}`,  (err) => {
                    //         if (err) throw err;
                    //         console.log(`${doc}was deleted`);
                    //     }));
                    // }
                }
            });

            assignorObject.powersCount = powersCount;
            assignorObject.cpaCount = cpaCount;
            assignorObject.dotCount = dotCount;
            assignorObject.pre_assigCount = pre_assigCount;
            assigCountList.push(assignorObject);
            console.log('count', count, result[0].length, assigCountList.length); 
            if (result[0].length == assigCountList.length){
                console.log('hey Ill save');
                let assinorstDocData =   json2xls(assigCountList);
                fs.writeFileSync('documents recount.xlsx', assinorstDocData, 'binary');
                Promise.all([promList]).then( () => console.log('copy done')).catch(err => console.log(err));
            }
        });
    });   
    
});
