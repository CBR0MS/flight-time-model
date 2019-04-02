var imagemin = require("imagemin"),
  webp = require("imagemin-webp"),
  outputFolder = "./",
  JPEGImages = "./*.jpg";

imagemin([JPEGImages], outputFolder, {
  plugins: [
    webp({
      quality: 65 // Quality setting from 0 to 100
    })
  ]
});
