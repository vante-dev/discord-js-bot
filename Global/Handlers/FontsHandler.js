const fs = require('fs');
const path = require('path');
const GlobalFonts = require('@napi-rs/canvas').GlobalFonts;
const { error } = require('./Logger')

function registerFontsFromDirectory(fontsDirectory) {
  fs.readdir(fontsDirectory, (err, files) => {
    if (err) {
      error('Error reading directory: ' + err);
      return;
    }

    const fontFiles = files.filter(file => /\.(ttf|otf)$/.test(file));

    if (files) {
      fontFiles.forEach(fontFile => {
        const fontName = path.basename(fontFile, path.extname(fontFile));
        const fontPath = path.join(fontsDirectory, fontFile);
        GlobalFonts.registerFromPath(fontPath, fontName);
      });
    }
  });
}

// Usage example
const fontsDirectory = path.join(__dirname, '../../Assets/Fonts');
registerFontsFromDirectory(fontsDirectory);