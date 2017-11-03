const path = require('path'), 
fs =  require('fs');


let pdfOriginalFiles = fs.readdirSync('H:/USER/Jobstudents/powers/');
pdfOriginalFiles = pdfOriginalFiles.filter(file => file.substr(-4) === '.pdf').map( file => file.replace('.pdf', ''));

let pdfConvertedFiles = fs.readdirSync('H:/USER/Jobstudents/powers/HtmltoPDF/');
pdfConvertedFiles = pdfConvertedFiles.filter(file => file.substr(-4) === '.pdf').map( file => file.replace('.pdf', ''));

pdfOriginalFiles.forEach( file => pdfConvertedFiles.includes(file) ? console.log(file) : false );