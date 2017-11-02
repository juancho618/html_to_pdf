const fs = require('fs');
const pdf = require('html-pdf');
const path = './htmlFiles'
const options = { format: 'Letter' };

fs.readdir( path, (err, items) => {
    if (items.length > 0) {
        items.forEach( i => {
            const fileName = i.replace('.html', '');
            const html = fs.readFileSync('./htmlfiles/' + i, 'utf8');
            pdf.create(html, options).toFile('./pdfFiles/' + fileName + '.pdf', (err, res) => {
                if (err) return console.log(err);
                    console.log(res); // { filename: '/app/businesscard.pdf' }
                });
        })
    }   
});