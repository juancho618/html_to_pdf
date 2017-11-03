const fs = require('fs');
const path = './pdfFiles/'; //test path

fs.readdir( path, (err, items) => {
    if (items.length > 0) {
        items.forEach( i => {
            if (i.toLowerCase().includes('.html')) {
                const fileName = i.replace('.html', '');
                fs.rename(path + i, path + fileName, function (err) {
                    if (err) throw err;
                    console.log('renamed complete');
                  });
            }            
        })
    }
});
