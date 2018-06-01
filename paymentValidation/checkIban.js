const XLSX = require('xlsx');
const IBAN = require('iban');
const fs = require('fs.extra');
const json2xls = require('json2xls');

const workbook = XLSX.readFile('sepaList.xlsx');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["_1"]);
console.log('this is the size before: ', xlData.length);

let validPayment = xlData.filter(a => IBAN.isValid(a.IBAN.trim())).map( item => item);

console.log('this is the size BIC: ', validPayment.length);

let xlPayment =   json2xls(validPayment);

fs.writeFileSync('filteredIbanList.xlsx', xlPayment, 'binary');





