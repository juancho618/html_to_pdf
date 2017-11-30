const XLSX = require('xlsx');
const IBAN = require('iban');
const bic = require('bic');
const json2xls = require('json2xls');
const fs = require('fs.extra');

const workbook = XLSX.readFile('trucks contracts matrix (mail merge source)30_11.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

let toBePayed = xlData.filter(assignor => {
    if (assignor.hasOwnProperty('IBAN') && assignor.hasOwnProperty('BIC') && (parseInt(assignor.pay_fix) > 0)) {
        if (!assignor.hasOwnProperty('Fixed_part_paid')) {
            return assignor;
        }else if (assignor.Fixed_part_paid.toUpperCase().trim() != 'YES'){
            return assignor;
        }
    }
});

let validPayment = toBePayed.filter(a => IBAN.isValid(a.IBAN.trim()) && bic.isValid(a.BIC.trim())).map( item => ({
    company: item.company_name,
    Ident: item.Ident,
    IBAN: item.IBAN,
    BIC: item.BIC,
    pay_fix: item.pay_fix
}));
let invalidIBAN = toBePayed.filter(a => !IBAN.isValid(a.IBAN.trim())).map( item => ({
    company: item.company_name,
    Ident: item.Ident,
    IBAN: item.IBAN,
    BIC: item.BIC,
    pay_fix: item.pay_fix
}));
let invalidIBIC = toBePayed.filter(a => !bic.isValid(a.BIC.trim())).map( item => ({
    company: item.company_name,
    Ident: item.Ident,
    IBAN: item.IBAN,
    BIC: item.BIC,
    pay_fix: item.pay_fix
}));

let xlPayment =   json2xls(validPayment);
let xlInvalidIban =   json2xls(invalidIBAN);
let xlInvalidBic =   json2xls(invalidIBIC);

fs.writeFileSync('to_be_paid.xlsx', xlPayment, 'binary');
fs.writeFileSync('invalid_IBAN.xlsx', xlInvalidIban, 'binary');
fs.writeFileSync('invalid_BIC.xlsx', xlInvalidBic, 'binary');

// console.log(xlData.length);
// console.log(toBePayed.length);
// console.log(validPayment.length);
// console.log(invalidIBAN.length);
// console.log(invalidIBIC.length);

