/**
 * Gets the data of de CPA's, DoT's and from the powers of different companies and create the folders per assignor.
 */

const path = require('path');
const { join } = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);
const { lstatSync, readdirSync, statSync, copyFile  } = require('fs');

const workbook2 = XLSX.readFile('newListNumber.xlsx');
const sheet_name_list2 = workbook2.SheetNames;
let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Sheet 1"]);


//Read Line node js
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


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


  //Extracts Id number exluding the underscore and the first two letters!
  let tempId = (id) =>{
    
    const containsOrgan = id.includes('organ');
    const reLetters = new RegExp('^[a-zA-Z]{2}');

    if (reLetters.exec(id)){ // if it starts with two letters
        const containsOrgan = id.includes('organ');
        if (id.includes('_')){
            const newId = id.slice(3);        
            if (containsOrgan)
                newId.concat('_organ').concat('_organ');
            return newId;
        } else {
            const newId = id.slice(2);
            if (containsOrgan)
                newId.concat('_organ');
            return newId;
        }
    }
    return id;
};



//To get the list of the directories inside of a directory
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>  readdirSync(source).map(name => join(source, name)).filter(isDirectory)
//new dir method
const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

const CPA = getList('H:\\USER\\Jobstudents\\Trucks\\CPAs');
const DoT = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\DoT_2sig_Stamped'); //Not included for now
const DoTo = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\Dot_o_Stamped');
const DoT2sig = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\DoT_2sig');
const powers = getList('H:\\USER\\Jobstudents\\Trucks\\powersList');
const preAssigments = getList('H:\\USER\\Jobstudents\\Trucks\\pre-assignments');

// const HtmltoPDF = getList('H:\\USER\\Jobstudents\\powers\\HtmltoPDF');
// const ocrError = getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\error');
// const ocrGodd =  getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\good');
// const ocrToBe =  getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\to be converted');

let suspiciousFiles = [];
let missing = [];
let assignors = [];
let preassignors = []; 
let isPreassignor = false;


Promise.all([CPA, powers, DoTo, preAssigments, DoT, DoT2sig]).then( values =>{
    // creating the folders
    const destination = 'H:/USER/Jobstudents/Trucks/Submission List'; //H:/USER/Jobstudents/Trucks/Submission List  C:/Users/Escobar/Desktop/newList2
    
    // let numbered = xlData.filter(x => x.hasOwnProperty('Assigner_Number_writ'));

    let numbered = xlData.filter(x => x.hasOwnProperty('company_name') && x.hasOwnProperty('Assignor_Number'));
    console.log(numbered.length);
    // let assNumber = numbered.map(x => x.Assignor_Number);
    // assNumber = assNumber.sort((a,b) => b-a);
    numbered = numbered.filter(x => parseInt(x.Assignor_Number)>=647);
    // Loop to create the folders and complete all the documents per assignor
    let listCounter = 0;
    numbered.forEach(i => {
        let documentsFound = [];
        i.company_name = i.company_name.replace('/', '.'); //to avoid subfoldering
        i.company_name = i.company_name.replace('\\r', '');
        
        if (true){//!i.company_name.includes('LGP Unternehmensbeteiligung GmbH'
            //Get PreAssignors
            if ( (i.Assig_Number_writ && (i.Assig_Number_writ != i.Assignor_Number)) || (i.Pre_assig_of)){
                preassignors.push(i);
                isPreassignor = true;
            } else {
                assignors.push(i);
                isPreassignor = false;
            }

            //The idea is to save first the list of the Assignors
            if (isPreassignor == false){
                //Folder structure name
                const savePath = `${destination}/${i.Assignor_Number} - ${i.company_name} - ${i.Ident}`; //${i['Assigner_Number_writ ']} -
                const extractId = tempId(i.Ident.trim());

                let missDoc = {target: i.company_name, 
                    originalId: i.Ident, usedId: extractId, 
                    CPA: true, DOT: true, Power: true, Preassigment: 'N/A', 
                    idType: i.Ident_type,cpaMatch: false,dotMatch: false,powerMatch: false, preassigmentMatch: false, 
                    Assig_Number_writ: i['Assig_Number_writ'], 
                    Assignor_Number: i['Assignor_Number'],
                    isPreassignor: false,
                    company_form: i.Company_form}

                if (!fs.existsSync(savePath)){
                    fs.mkdirSync(savePath);
                }

                // to store all the matches with the cpa files
                let cpaListFound = [];
                // CPA
                values[0].forEach(d => {
                    // Search by the ID value match
                    if (d.includes(extractId)) {
                        cpaListFound.push(d);
                        documentsFound.push('CPA');
                    }
                    else if (d.includes(i.company_name)){
                        missDoc.cpaMatch = true;
                        suspiciousFiles.push({file: d,type:'CPA', target: i.company_name, originalId: i.Ident, usedId: extractId});
                    }
                })

                // to store all the matche swith the powers.
                let powersListFound = [];
                // Powers
                values[1].forEach(d => {
                    if (d.includes(extractId)) {
                        powersListFound.push(d);
                        documentsFound.push('Power');
                    }
                    else if (d.includes(i.company_name)){ //Could not be find by ID but it is present with the company name
                        missDoc.powerMatch = true;
                        suspiciousFiles.push({file: d,type:'Powers',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                    }
                })

                // to store all the matches with the powers.
                let dotListFound = [];
                // // DoT_o_Stamped
                // values[2].forEach(d => {
                //     if (d.includes(extractId)) {
                //         dotListFound.push(d);
                //         copyFile('H:\\USER\\Jobstudents\\Trucks\\DoTs\\Dot_o_Stamped' + '/' + d, `${savePath}/${d}`, (err)=>{
                //             if (err) throw err;
                //             console.log(`${d} was copied`);
                //         });
                //         documentsFound.push('DOT');
                //     }
                //     else if (d.includes(i.company_name)){
                //         missDoc.dotMatch = true;
                //         suspiciousFiles.push({file: d,type:'DOT',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                //     }
                // })

                // DoT_2sig_stamped
                // values[4].forEach(d => {
                //     if (d.includes(extractId)) {
                //         dotListFound.push(d);
                //         copyFile('H:\\USER\\Jobstudents\\Trucks\\DoTs\\DoT_2sig_Stamped' + '/' + d, `${savePath}/${d}`, (err)=>{
                //             if (err) throw err;
                //             console.log(`${d} was copied`);
                //         });
                //         documentsFound.push('DOT');
                //     }
                //     else if (d.includes(i.company_name)){
                //         missDoc.dotMatch = true;
                //         suspiciousFiles.push({file: d,type:'DOT',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                //     }
                // })

                // Tempo 2sig
                // values[5].forEach(d => {
                //     if (d.includes(extractId)) {
                //         dotListFound.push(d);
                //         // copyFile('H:\\USER\\Jobstudents\\Trucks\\DoTs\\DoT_2sig' + '/' + d, `${savePath}/${d}`, (err)=>{
                //         //     if (err) throw err;
                //         //     console.log(`${d} was copied`);
                //         // });
                //         documentsFound.push('DOT');
                //     }
                //     else if (d.includes(i.company_name)){
                //         missDoc.dotMatch = true;
                //         suspiciousFiles.push({file: d,type:'DOT',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                //     }
                // })

                // Handler for more than one POWERS, DOT or CPA
                if (powersListFound.length > 1){
                    rl.question(`There is more than one power for ${i.company_name}: \n ${powersListFound}: `, (answer) => {
                        if (!isNaN(parseInt(answer))){
                            const insertedValue = parseInt(answer);
                            const selectedFile = powersListFound[insertedValue];
                            powersListFound.splice(insertedValue, 1);
                            console.log(`the inserted value is ${insertedValue}`);

                            powersListFound.forEach( power =>{
                                fs.move(`H:/USER/Jobstudents/Trucks/powersList/${power}`, `C:/Users/Escobar/Desktop/CopiesSaved/${power}`, function (err) {
                                    if (err) {
                                    throw err;
                                    }
                                
                                    console.log(`${power} moved`);
                                    return  copyFile(`H:\\USER\\Jobstudents\\Trucks\\powersList/${selectedFile}`, `${savePath}/${selectedFile}`, (err)=>{
                                        if (err) throw err;
                                        console.log(`${selectedFile} was copied`);
                                        rl.close();
                                    });
                                });
                            });    

                        }                 
                    });
                } else if (powersListFound.length == 1){
                    const selectedFile = powersListFound[0];
                    copyFile(`H:\\USER\\Jobstudents\\Trucks\\powersList/${selectedFile}`, `${savePath}/${selectedFile}`, (err)=>{
                        if (err) throw err;
                        console.log(`${selectedFile} was copied`);
                    });
                }

                if (cpaListFound.length > 1){
                    rl.question(`There is more than one CPA for ${i.company_name}: \n ${cpaListFound}: `, (answer) => {
                        const insertedValue = parseInt(answer);
                        const selectedFile = cpaListFound[insertedValue];
                        cpaListFound.splice(insertedValue, 1);
                        console.log(`the inserted value is ${insertedValue}`);

                        cpaListFound.forEach( cpa =>{
                            fs.move(`H:/USER/Jobstudents/Trucks/CPAs/${cpa}`, `C:/Users/Escobar/Desktop/CopiesSaved/${cpa}`, function (err) {
                                if (err) {
                                  throw err;
                                }
                               
                                console.log(`${cpa} moved`);
                                return  copyFile(`H:/USER/Jobstudents/Trucks/CPAs/${selectedFile}`, `${savePath}/${selectedFile}`, (err)=>{
                                    if (err) throw err;
                                    console.log(`${selectedFile} was copied`);
                                    rl.close();
                                });
                              });
                        });    
                    });     
                } else if(cpaListFound.length == 1){
                    const selectedFile = cpaListFound[0];
                    copyFile(`H:/USER/Jobstudents/Trucks/CPAs/${selectedFile}`, `${savePath}/${selectedFile}`, (err)=>{
                        if (err) throw err;
                        console.log(`${selectedFile} was copied`);
                    });
                }

                if (dotListFound.length == 1){
                    const selectedFile = cpaListFound[0];
                    copyFile(`H:/USER/Jobstudents/Trucks/DoTs/DoT_2sig/${selectedFile}`, `${savePath}/${selectedFile}`, (err)=>{
                            if (err) throw err;
                            console.log(`$${selectedFile} was copied`);
                        });
                }


                if (!documentsFound.includes('DOT') || !documentsFound.includes('CPA') || !documentsFound.includes('Power')){
                    
                    if (!documentsFound.includes('DOT'))
                        missDoc.DOT = false;
                    if (!documentsFound.includes('CPA'))
                        missDoc.CPA = false;
                    if (!documentsFound.includes('Power'))
                        missDoc.Power = false;

                    missing.push(missDoc);
                }

            }    
        }

        if (numbered.length == listCounter){
            let datam =   json2xls(missing);
            fs.writeFileSync('missigList.xlsx', datam, 'binary');
        }
       
        listCounter ++;
    
    });

    //Once all the assignors are processed the Idea is to process the pre-assignors
    let preAssignorCount = 0;
    preassignors.forEach(pre => {
        if (true){ //!pre.company_name.includes('LGP Unternehmensbeteiligung GmbH'
            let documentsFound = [];
            console.log('pre', pre.company_name);
            const extractId = tempId(pre.Ident.trim());
            const AssignorId = tempId(pre.pre_assig_of.trim()); //Main assignor Id
            const directoriesList = dirs(`${destination}`);
            const parentDir = directoriesList.filter(dir => dir.includes(AssignorId));
            console.log(parentDir);
    
            let missDoc = {
                target: pre.company_name, originalId: pre.Ident, 
                usedId: extractId, CPA: true, 
                DOT: true, Power: true, 
                Preassigment: 'N/A', idType: pre.Ident_type,cpaMatch: false,dotMatch: false,powerMatch: false, preassigmentMatch: false,
                Assig_Number_writ: pre['Assig_Number_writ'],
                Assignor_Number: pre['Assignor_Number'],
                isPreassignor: true,
                company_form: pre.Company_form
            };
    
            Promise.all([powers, preAssigments]).then(v=>{
    
                // Preassignor power
                v[0].forEach(d => {
                    if (d.includes(extractId)) {
                        copyFile('H:\\USER\\Jobstudents\\Trucks\\powersList' + '/' + d, `${destination}/${parentDir}/${d}`, { replace: false }, (err)=>{
                            if (err) throw err;
                            console.log(`${d} was copied`);
                        });
                        documentsFound.push('Power');
                    }
                    else if (d.includes(pre.company_name)){
                        missDoc.powerMatch= true;
                        suspiciousFiles.push({file: d,type:'Powers-preAssignor',  target: pre.company_name, originalId: pre.Ident, usedId: extractId});
                    }
                })
                
                //For the preassigments
                v[1].forEach(d => {
                    if (d.includes(extractId)) {
                        copyFile('H:\\USER\\Jobstudents\\Trucks\\pre-assignments' + '/' + d, `${destination}/${parentDir}/${d}`, { replace: false }, (err)=>{
                            if (err) throw err;
                            console.log(`${d} was copied`);
                        });
                        documentsFound.push('Preassigment');
                    }
                    else if (d.includes(pre.company_name)){
                        missDoc.preassigmentMatch = true;
                        suspiciousFiles.push({file: d,type:'preassigment', target: pre.company_name, originalId: pre.Ident, usedId: extractId});
                    }
                })
    
                //Add validation for missing documents for the pre-Assignor
                if ( !documentsFound.includes('Preassigment') || !documentsFound.includes('Power')){
                    
                    if (!documentsFound.includes('Preassigment'))
                        missDoc.Preassigment = false;
                    if (!documentsFound.includes('Power'))
                        missDoc.Power = false;
                    missing.push(missDoc);
                }
                if (preAssignorCount == preassignors.length){
                                //TO BE REFACTORED!!!
                console.log('Total Number Pre-Assignors', preassignors.length );
                console.log('Total Number Assignors', assignors.length);
    
                const assignorsList = json2xls(assignors);
                const preassignorsList = json2xls(preassignors);
                fs.writeFileSync('assignorsList.xlsx', assignorsList, 'binary');
                fs.writeFileSync('preassignorsList.xlsx', preassignorsList, 'binary');
    
                /* create sheet data & add to workbook for the json file */
                let data =   json2xls(suspiciousFiles);
                fs.writeFileSync('secondList.xlsx', data, 'binary');
    
                /* create sheet data & add to workbook for the json file */
                let datam =   json2xls(missing);
                fs.writeFileSync('missigList.xlsx', datam, 'binary');
                   }
    
                  preAssignorCount ++;
            })
        }
       
        

    });
        
   
  

}).catch(e => console.error('error', e));

