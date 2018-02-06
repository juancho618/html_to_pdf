
require('pdfjs-dist');

module.exports = {
    getPDFAMetadata: (filePath) => {
        return PDFJS.getDocument(filePath).then(function (pdfDoc_) {
            pdfDoc = pdfDoc_;   
            return pdfDoc.getMetadata().then(function(data) {
                if (data.metadata.hasOwnProperty('_metadata')) {
                    if (data.metadata._metadata['pdfaid:conformance'] && data.metadata._metadata['pdfaid:conformance'] == 'A' ){
                        return true
                    }
                }
                return false
                console.log(data.metadata._metadata['pdfaid:conformance']); // Metadata object here
            }).catch(function(err) {
               console.log('Error getting meta data');
               console.error(err);
            });
        
           // Render the first page or whatever here
           // More code . . . 
        }).catch(function(err) {
            console.log(`Error getting PDF from ${filePath}`);
            console.error(err);
        });
    }
}


