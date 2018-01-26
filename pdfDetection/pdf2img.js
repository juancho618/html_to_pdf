// source: https://github.com/yakovmeister/pdf2image
//for the pythonshell: https://www.npmjs.com/package/python-shell

let PythonShell = require('python-shell');
const PDF2Pic = require('pdf2pic');
const fs = require('fs.extra');

const converter = new PDF2Pic({
    density: 100,           // output pixels per inch
    savename: "aa",   // output file name
    savedir: "./imgs/",    // output file location
    format: "png",          // output file format
    size: 600               // output size in pixels
})
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
let pdfList = getList('./pdfList');

Promise.all([pdfList]).then( docs =>{
    docs[0].forEach((pdf, index) =>{
        const converter = new PDF2Pic({
            density: 100,           // output pixels per inch
            savename: "aa"+index,   // output file name
            savedir: "./imgs/",    // output file location
            format: "png",          // output file format
            size: 600               // output size in pixels
        })
        converter.convertBulk(`./pdfList/${pdf}`, -1)
        .then(resolve => {
            let pages = resolve.map(p => p.name);
            PythonShell.defaultOptions = { args: pages};
            const options = {
               mode: 'text',
               pythonPath: 'path/to/python',
               pythonOptions: ['-u'],
               scriptPath: 'path/to/my/scripts',
               args: pages
             };
            PythonShell.run('./img.py', function (err, results) {
               if (err) throw err;
               const res = results[0];
               if (res > 0.5) {
                   console.log(`${pdf} is a corrupted file`);
               }
               else{
                   console.log(`${pdf} is a good file`);
               }
             });
            if (index == docs[0].length - 1) { 
                getList('./imgs').then(result =>{
                    setTimeout(() => {
                        result.forEach( file => fs.unlinkSync( './imgs/' + file ));
                      }, 10000);                    
                })
            }             
        }) 
            
    })      
    // htmlFiles.forEach( file => fs.unlinkSync( 'H:/USER/Jobstudents/powers/' + file ));
})
