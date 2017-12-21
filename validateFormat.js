const XLSX = require('xlsx');
const IBAN = require('iban');
const bic = require('bic');
const json2xls = require('json2xls');
const fs = require('fs.extra');

const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);
const re = /^[A-Za-z][A-Za-z]_*/;
let lista = xlData.filter(d => d.hasOwnProperty('Ident') && d.hasOwnProperty('company_name') );

let no_match = lista.map(e => re.exec(e.Ident));

console.log(lista.length);
console.log(no_match.length);