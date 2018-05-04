require('pdfjs-dist');
module.exports = {
    pdfToText : (data) => {
        console.assert(data instanceof ArrayBuffer || typeof data == 'string');
        return PDFJS.getDocument(data).then( (pdf) => {

            const total = pdf.numPages;
            let layers = {};
            let containText = null;
            let listAsync = [];
            for (i = 1; i <= total; i++) {
                listAsync.push(pdf.getPage(i));
               
            }

            return Promise.all(listAsync).then(results => {
                let async2 = [];
               
                results.forEach(page => async2.push(page.getTextContent()));

                return Promise.all(async2).then(contents => {
                    let items = contents.map((element) => (element.hasOwnProperty('items') && element.items.length > 0) ? true : false);
                    console.log('items', items);
                    if (items.includes(true)){
                        containText = true
                    }
                    else{
                        containText = false
                    }
                    return containText;
                });

            })


        });

    } // end of pdfToText()
};


