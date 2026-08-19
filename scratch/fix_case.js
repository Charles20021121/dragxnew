const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'silence', 'car type');
const files = fs.readdirSync(dir);

console.log("Original files on disk:", files);

files.forEach(file => {
  const lower = file.toLowerCase();
  if (file !== lower) {
    const oldPath = path.join(dir, file);
    const tempPath = path.join(dir, `_temp_${lower}`);
    const newPath = path.join(dir, lower);
    
    fs.renameSync(oldPath, tempPath);
    fs.renameSync(tempPath, newPath);
    console.log(`Renamed: ${file} -> ${lower}`);
  }
});

console.log("Updated files on disk:", fs.readdirSync(dir));
