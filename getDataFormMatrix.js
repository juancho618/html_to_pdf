/**
 * Gets the data of de CPA's, DoT's and from the powers of different companies and create the folders per assignor.
 */

const path = require('path');
const fs = require('fs.extra');
const XLSX = require('xlsx');
const json2xls = require('json2xls');
const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);
const { lstatSync, readdirSync } = require('fs');

const workbook2 = XLSX.readFile('newListNumber.xlsx');
const sheet_name_list2 = workbook2.SheetNames;
let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Sheet 1"]);



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
    const reLetters = new RegExp('^[a-zA-Z]{2}');

    if (reLetters.exec(id)){ // if it starts with two letters
        if (id.includes('_')){
            return id.slice(3);
        } else {
            return id.slice(2);
        }
    }
    return id;
};



//To get the list of the directories inside of a directory
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const CPA = getList('H:\\USER\\Jobstudents\\Trucks\\CPAs');
const DoT = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\DoT_2sig_Stamped'); //Not included for now
const DoTo = getList('H:\\USER\\Jobstudents\\Trucks\\DoTs\\Dot_o_Stamped');
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

Promise.all([CPA, powers, DoTo, preAssigments]).then( values =>{
    // creating the folders
    const destination = 'C:\\Users\\Escobar\\Desktop\\newList2'; //'H:\\USER\\Jobstudents\\DocumentsList'
    
    // let numbered = xlData.filter(x => x.hasOwnProperty('Assigner_Number_writ'));

    let numbered = xlData2.filter(x => x.hasOwnProperty('company_name'));
    console.log(numbered.length);
    
    
    numbered.forEach(i => {
        let documentsFound = [];
        i.company_name = i.company_name.replace('/', '.'); //to avoid subfoldering
        i.company_name = i.company_name.replace('\\r', '');
        

        //Get PreAssignors
        if (i.Assig_Number_writ && (i.Assig_Number_writ != i.Assignor_Number)){
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

            let missDoc = {target: i.company_name, originalId: i.Ident, usedId: extractId, CPA: true, DOT: true, Power: true, idType: i.Ident_type,cpaMatch: false,dotMatch: false,powerMatch: false, Assig_Number_writ: i['Assig_Number_writ']}

            if (!fs.existsSync(savePath)){
                fs.mkdirSync(savePath);
            }
            // CPA
            values[0].forEach(d => {
                if (d.includes(extractId)) {
                    fs.copy('H:\\USER\\Jobstudents\\Trucks\\CPAs' + '/' + d, `${savePath}/${d}`, { replace: false });
                    documentsFound.push('CPA');
                }
                else if (d.includes(i.company_name)){
                    missDoc.cpaMatch = true;
                    suspiciousFiles.push({file: d,type:'CPA', target: i.company_name, originalId: i.Ident, usedId: extractId});
                }
            })

            // Powers
            values[1].forEach(d => {
                if (d.includes(extractId)) {
                    fs.copy('H:\\USER\\Jobstudents\\Trucks\\powersList' + '/' + d, `${savePath}/${d}`, { replace: false });
                    documentsFound.push('Power');
                }
                else if (d.includes(i.company_name)){
                    missDoc.powerMatch = true;
                    suspiciousFiles.push({file: d,type:'Powers',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                }
            })

            // DoT_o_Stamped
            values[2].forEach(d => {
                if (d.includes(extractId)) {
                    fs.copy('H:\\USER\\Jobstudents\\Trucks\\DoTs\\Dot_o_Stamped' + '/' + d, `${savePath}/${d}`, { replace: false });
                    documentsFound.push('DOT');
                }
                else if (d.includes(i.company_name)){
                    missDoc.dotMatch = true;
                    suspiciousFiles.push({file: d,type:'DOT',  target: i.company_name, originalId: i.Ident, usedId: extractId});
                }
            })

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
    })

    //Once all teh assignors are processed the Idea is to process the pre-assignors
    preassignors.forEach(pre => {
        console.log('pre', pre.company_name);
        const extractId = tempId(pre.Ident.trim());
        const preAssignorId = tempId(pre.pre_assig_of.trim());
        //const directoriesList = getDirectories(`${destination}`);
        // console.log('list of directories', directoriesList);
        // const parentDir = directoriesList.filter(dir => dir.includes(preAssignorId));
        // Promise.all([powers, preAssigments]).then(v=>{

        //     // Preassignor power
        //     v[0].forEach(d => {
        //         if (d.includes(extractId)) {
        //             fs.copy('H:\\USER\\Jobstudents\\Trucks\\powersList' + '/' + d, `${savePath}/${d}`, { replace: false });
        //             documentsFound.push('Power');
        //         }
        //         else if (d.includes(pre.company_name)){
        //             missDoc.powerMatch = true;
        //             suspiciousFiles.push({file: d,type:'Powers -preAssignor',  target: pre.company_name, originalId: pre.Ident, usedId: extractId});
        //         }
        //     })

        //     //For the preassigments
        //     v[1].forEach(d => {
        //         if (d.includes(extractId)) {
        //             fs.copy('H:\\USER\\Jobstudents\\Trucks\\pre-assignments' + '/' + d, `${parentDir}/${d}`, { replace: false });
        //             documentsFound.push('Preassigment');
        //         }
        //         else if (d.includes(pre.company_name)){
        //             missDoc.cpaMatch = true;
        //             suspiciousFiles.push({file: d,type:'preassigment', target: pre.company_name, originalId: pre.Ident, usedId: extractId});
        //         }
        //     })

        // })
        

    });
        

    console.log('Total Number Pre-Assignors', preassignors.length, );
    console.log('Total Number Assignors', assignors.length);

    /*creates an excel file with the assignors and another one with the assignors*/
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
    
    


}).catch(e => console.error('error', e));

