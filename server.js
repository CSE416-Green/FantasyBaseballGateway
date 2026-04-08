const path = require('path');
const gateway = require('express-gateway');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { exec } = require('child_process');

gateway().load(path.join(__dirname, 'config'))
  .run()
  .then(() => {
    console.log('🚀 Gateway is ready. Running setup script...');
    exec('sh ./inject-admin.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return;
      }
      if (stdout) console.log(`Output: ${stdout}`);
      if (stderr) console.error(`Error Output: ${stderr}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start gateway:', err);
  });
