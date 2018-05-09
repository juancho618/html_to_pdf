const XLSX = require('xlsx');
const json2xls = require('json2xls');
const fs = require('fs.extra');

const workbook = XLSX.readFile('data2.xlsm');
const sheet_name_list = workbook.SheetNames;
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Tabelle1"]);

let newAssignors = xlData.filter(assignor => {
    // && assignor.hasOwnProperty('Assignor_Number')
    if ( assignor.hasOwnProperty('company_name') && assignor.hasOwnProperty('Assignor_Number')  ) { //other val: && !assignor.signdate_CDC_DoT.includes('still open') assignor.hasOwnProperty('signdate_CDC_DoT') && assignor.hasOwnProperty('signdate_assig_DoT') && assignor.hasOwnProperty('signdate_CDC_CPA ')  && assignor.hasOwnProperty('signdate_assig_CPA')
   
   
    //   if ( assignor.hasOwnProperty('Assig_included_in_writ') ){
    //         if (!assignor.Assig_included_in_writ.toUpperCase().includes('YES')){
    //             return assignor;
    //         }
    //     } else {
    //         return assignor; //some reduncancy??
    //     } && assignor.hasOwnProperty('signdate_CDC_CPA') && assignor.hasOwnProperty('signdate_assig_CPA')
    
    //     const cpaCdcDate = (assignor['signdate_CDC_CPA '].includes('17') || assignor['signdate_CDC_CPA '].includes('18')); 
    //     const cpaAssignorDate = (assignor['signdate_assig_CPA'].includes('17') || assignor['signdate_assig_CPA'].includes('18'));
       // if ( cpaCdcDate &&  cpaAssignorDate){
            // if ( assignor.hasOwnProperty('Included_by_writ_of')){
                
            //     if (assignor['Included_by_writ_of'] != 'not claiming')
            //         console.log(assignor['pre_assig_of']);
            //         return assignor;
            // }
                // if (assignor.Included_by_writ_of.toUpperCase().includes('DEC')){
                //                 return assignor;
                // }
            // } else { //or empty
            //     return assignor;
            // }
        //}       
        if (assignor.Assignor_Number > 0 || assignor.Assignor_Number == '331a'){
            if (assignor.pre_assig_of)
                 assignor.pre_assig_of;
            else
                assignor.pre_assig_of = '';
            return assignor;
        }
            
     }
});

let newList =   json2xls(newAssignors);
console.log(newAssignors.length);
fs.writeFileSync('newListNumber.xlsx', newList, 'binary');