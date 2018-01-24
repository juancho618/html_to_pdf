// source: https://github.com/yakovmeister/pdf2image
//for the pythonshell: https://www.npmjs.com/package/python-shell

let PythonShell = require('python-shell');
const PDF2Pic = require('pdf2pic')
const converter = new PDF2Pic({
    density: 100,           // output pixels per inch
    savename: "aa",   // output file name
    savedir: "./imgs/",    // output file location
    format: "png",          // output file format
    size: 600               // output size in pixels
})

// by default the first page of the pdf will be converted
// to image
converter.convertBulk("./black.pdf", -1)
         .then(resolve => {
             console.log(resolve);
             console.log(resolve.length);
             PythonShell.run('./img.py', function (err, results) {
                if (err) throw err;
                console.log('results: %j', results);
              });
             console.log("image converted successfully");
         })