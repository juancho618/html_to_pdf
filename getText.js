require('pdfjs-dist');
let complete = 0;

    /**
     *
     * @param data ArrayBuffer of the pdf file content
     * @param callbackPageDone To inform the progress each time
     *        when a page is finished. The callback function's input parameters are:
     *        1) number of pages done;
     *        2) total number of pages in file.
     * @param callbackAllDone The input parameter of callback function is 
     *        the result of extracted text from pdf file.
     *
     */
      let pdfToText = function(data){
     console.assert( data  instanceof ArrayBuffer  || typeof data == 'string' );
     return PDFJS.getDocument( data ).then( function(pdf) {
     

     var total = pdf.numPages;  
     var layers = {};        
     let containText = null;
     var count = 0;
     let listAsync = [];
     for (i = 1; i <= total; i++){
        listAsync.push(pdf.getPage(i));
     }

     return Promise.all(listAsync).then( results =>{
         results.forEach(page => {
            var n = page.pageNumber;
            page.getTextContent().then( function(textContent){
                if (textContent.items.length > 0){
                    containText = true;
                } else {
                    containText = false;
                }
              if( null != textContent.bidiTexts ){
                var page_text = "";
                var last_block = null;
                for( var k = 0; k < textContent.bidiTexts.length; k++ ){
                    var block = textContent.bidiTexts[k];
                    if( last_block != null && last_block.str[last_block.str.length-1] != ' '){
                        if( block.x < last_block.x )
                            page_text += "\r\n"; 
                        else if ( last_block.y != block.y && ( last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null ))
                            page_text += ' ';
                    }
                    page_text += block.str;
                    last_block = block;
                }
    
                textContent != null && console.log("page " + n + " finished."); //" content: \n" + page_text);
                layers[n] =  page_text + "\n\n";
              }
              
            }); // end  of page.getTextContent().then
            count++;
            if (count == results.length){
                return containText;
             }
         })
         
     })
      
    
  });
 
 }; // end of pdfToText()

 let ret = pdfToText('C:\\Users\\Escobar\\Documents\\HtmltoPDF\\Brockmann-Holz GmbH, DE_119262095_CPA_2sig_o.pdf');

 ret.then(x => console.log(x));