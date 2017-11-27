const path = require('path')
const fs = require('fs.extra')
const XLSX = require('xlsx')
const workbook = XLSX.readFile('trucks contracts matrix (mail merge source).xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

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


const CPA = getList('H:\\USER\\Jobstudents\\CPAs');
const DoT = getList('H:\\USER\\Jobstudents\\DoTs\\DoT_2sig_Stamped');
const powers = getList('H:\\USER\\Jobstudents\\powersList')
// const HtmltoPDF = getList('H:\\USER\\Jobstudents\\powers\\HtmltoPDF');
// const ocrError = getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\error');
// const ocrGodd =  getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\good');
// const ocrToBe =  getList('H:\\USER\\Jobstudents\\powers\\OCR-PDF-A\\to be converted');

Promise.all([CPA, DoT, powers]).then( values =>{
    // creating the folders
    const destination = 'H:\\USER\\Jobstudents\\DocumentsList';
    
    let numbered = xlData.filter(x => x.hasOwnProperty('Assigner_Number_writ'));
    
    numbered.forEach(i => {
        const savePath = `${destination}/${i.Assigner_Number_writ} - ${i.company_name} - ${i.Ident}`;
        
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

        const extractId = tempId(i.Ident.trim());
        // console.log(`${i.Ident}, ${extractId}`);

        if (!fs.existsSync(savePath)){
            fs.mkdirSync(savePath);
            // fs.mkdirSync(`${savePath}/CPA`);
            // fs.mkdirSync(`${savePath}/DOT`);
            // fs.mkdirSync(`${savePath}/powers`);
        }
        // CPA
        values[0].forEach(d => {
            if (d.includes(extractId)) {
                fs.copy('H:\\USER\\Jobstudents\\CPAs' + '/' + d, `${savePath}/${d}`, { replace: false });
            }
        })

        // DOT
        values[1].forEach(d => {
            if (d.includes(extractId)) {
                fs.copy('H:\\USER\\Jobstudents\\DoTs\\DoT_2sig_Stamped' + '/' + d, `${savePath}/${d}`, { replace: false });
            }
        })

        // Powers
        values[2].forEach(d => {
            if (d.includes(extractId)) {
                fs.copy('H:\\USER\\Jobstudents\\powersList' + '/' + d, `${savePath}/${d}`, { replace: false });
            }
        })
    })
    
    

})

