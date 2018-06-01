const fs = require('fs');
const path = 'C:\\Users\\Escobar\\Desktop\\pre\\'; 

fs.readdir( path, (err, items) => {
    if (items.length > 0) {
        items.forEach( i => {
            // if (i.toLowerCase().includes('.html')) {
                const fileName = i.replace(', ', '_');
                fs.rename(path + i, path + fileName, function (err) {
                    if (err) throw err;
                    console.log('renamed complete');
                  });
            // }            
        })
    }
});
