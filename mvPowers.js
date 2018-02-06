const path = require('path');
    const fs = require('fs.extra');
    const XLSX = require('xlsx');
    const json2xls = require('json2xls');

    // const savePath = `${__dirname}/../data/`;
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

    const workbook2 = XLSX.readFile(`C:\\Users\\Escobar\\Documents\\cdcAPP\\data\\newList2.xlsx`);
        const sheet_name_list2 = workbook2.SheetNames;
        let xlData2 = XLSX.utils.sheet_to_json(workbook2.Sheets["Sheet 1"]);

           // get list from folder function
           let getList = (path) =>  fs.readdirAsync( path );


                //Load sources
        //const CPA = getList('H:\\USER\\Jobstudents\\CPAs');
        //const DoTo = getList('H:\\USER\\Jobstudents\\DoTs\\Dot_o_Stamped');

        const powers = getList('H:\\USER\\Jobstudents\\powersList');//Async call to the sources

        Promise.all([powers]).then( values =>{
            
            console.log(values[0].length);
            

            let numbered = xlData2.filter(x => x.hasOwnProperty('company_name') && x.hasOwnProperty('Assignor_Number') && parseInt(x['Assignor_Number']) >=398 && parseInt(x['Assignor_Number']) <=464 );

            numbered.forEach(i => {
                //Extracts Id number
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

                values[0].forEach(d => {
                    if (d.includes(extractId)) {
                        console.log('hola');
                        fs.copy( 'H:\\USER\\Jobstudents\\powersList'+'/'+d, 'H:\\USER\\Jobstudents\\toBeConverted\\extra\\power'+'/'+d, { replace: false });
                    }
                })
        

            })

        })
