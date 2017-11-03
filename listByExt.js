const path = require('path'), 
      fs =  require('fs');

fs.readdir('H:/USER/Jobstudents/powers/', (err, files) => {
    let htmlFiles = files.filter(file => file.substr(-5) == '.html');
    let deletedFiles = htmlFiles.join(';');
    fs.writeFile('./deletedList.csv', deletedFiles, 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
            console.log('It\'s saved!');
        }
    });
    console.log(htmlFiles);
    htmlFiles.forEach( file => fs.unlinkSync( 'H:/USER/Jobstudents/powers/' + file ));
});



