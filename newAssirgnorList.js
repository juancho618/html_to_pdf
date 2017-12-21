const XLSX = require('xlsx');
const json2xls = require('json2xls');
const fs = require('fs.extra');

const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

let newAssignors = xlData.filter(assignor => {
    if ( assignor.hasOwnProperty('company_name') && assignor.hasOwnProperty('signdate_CDC_DoT') && assignor.hasOwnProperty('signdate_assig_DoT') && !assignor.signdate_CDC_DoT.includes('still open') ) {
      if ( assignor.hasOwnProperty('Assig_included_in_writ') ){
            if (!assignor.Assig_included_in_writ.toUpperCase().includes('YES')){
                return assignor;
            }
        } else {
            return assignor;
        }     
        
    }
});

let newList =   json2xls(newAssignors);
fs.writeFileSync('newList.xlsx', newList, 'binary');

// let xlInvalidIban =   json2xls(invalidIBAN);
// let xlInvalidBic =   json2xls(invalidIBIC);

// fs.writeFileSync('to_be_paid.xlsx', xlPayment, 'binary');
// fs.writeFileSync('invalid_list.xlsx', invalidData, 'binary');