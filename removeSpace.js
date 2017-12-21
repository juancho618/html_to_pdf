const XLSX = require('xlsx');
const IBAN = require('iban');
const bic = require('bic');
const json2xls = require('json2xls');
const fs = require('fs.extra');

const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

let clean = xlData.forEach(element => {
    if (element.hasOwnProperty('Ident')) {
        element.Ident = element.Ident.trim();
    }
})

let xlClean =   json2xls(clean);


fs.writeFileSync('data3.xlsx', xlClean, 'binary');

// let empty = xlData.filter(d => !d.hasOwnProperty('Ident') && d.hasOwnProperty('company_name'));

// empty.forEach(e => console.log(e.company_name));