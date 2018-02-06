let fs = require('fs'),
PDFParser = require("pdf2json");
let pdfParser = new PDFParser();

let containText = null;
module.exports ={
    containText : (filePath) => {
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const pages =  pdfData.formImage.Pages;
            
            pages.forEach(page => {
                if (page.Texts.length == 0) {
                    containText = false
                } else if(page.Texts.length > 0){
                    containText = true;
                }
            });
            console.log(containText);
           
            //fs.writeFile("./txt2.json", JSON.stringify(pdfData));
        });
        
       pdfParser.loadPDF(filePath);
       
    }
}
   