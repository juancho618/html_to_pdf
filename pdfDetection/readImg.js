var PNG = require('png-js');


PNG.decode('./imgs/aa_1.png', function(pixels) {
    console.log(pixels);
});

var getPixels = require("get-pixels")

getPixels("./imgs/aa_1.png", function(err, pixels) {
 if(err) {
   console.log("Bad image path")
   return
 }
 console.log("got pixels", pixels.shape.slice())
 console.log("1px", pixels)
})