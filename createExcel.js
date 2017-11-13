const path = require('path'), 
fs =  require('fs');
const excelbuilder = require('msexcel-builder');

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

let getList = (path) =>  fs.readdirAsync( path ).then( files =>  files.filter(file => file.substr(-4) == '.pdf')); 

// Getting all the required information
Promise.all([getList('H:/USER/Jobstudents/powers/HtmltoPdf'), getList('H:/USER/Jobstudents/powers/OCR-PDF-A/good'), getList('H:/USER/Jobstudents/powers/OCR-PDF-A/error'), getList('H:/USER/Jobstudents/powers')]).then( data => {
    // creation of the workbook
    let workbook = excelbuilder.createWorkbook('./', 'listOfDocuments.xlsx');
    let row = 2;

    let sheet1 = workbook.createSheet('HtmltoPdf', 200, 200);
    sheet1.set(1, 1, 'Html powers converted to PDF');
    data[0].forEach( file => {
        sheet1.set(1, row, file);
         row += 1;
    });

    let sheet2 = workbook.createSheet('toPDF/A with OCR', 200, 200);
    sheet2.set(1, 1, 'PDF to PDF/A OCR');
    row = 2;
    data[1].forEach( file => {
        sheet2.set(1, row, file);
         row += 1;
    });

    let sheet3 = workbook.createSheet('toPDF/A with OCR error', 200, 200);
    sheet3.set(1, 1, 'PDF to PDF/A OCR error list');
    row = 2;
    data[2].forEach( file => {
        sheet3.set(1, row, file);
         row += 1;
    });

    // let sheet4 = workbook.createSheet('list of all pdf', 200, 200);
    // sheet4.set(1, 1, 'total list');
    // row = 2;
    // data[3].forEach( file => {
    //     sheet4.set(1, row, file);
    //      row += 1;
    // });

    workbook.save((ok) => {
        if (!ok) 
            workbook.cancel();
        else
            console.log('congratulations, your workbook created');
    });   
})



