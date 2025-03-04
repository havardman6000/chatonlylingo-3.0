// netlify.js
// This file is used by Netlify to configure the build process

const { execSync } = require('child_process');

// Log Node.js version
console.log('Node.js version:', process.version);

// Log environment variables (for debugging)
console.log('Environment variables:');
console.log('- NODE_VERSION:', process.env.NODE_VERSION);
console.log('- NETLIFY_NEXT_PLUGIN_SKIP:', process.env.NETLIFY_NEXT_PLUGIN_SKIP);
console.log('- DISABLE_ESLINT_PLUGIN:', process.env.DISABLE_ESLINT_PLUGIN);

// Check if we have the right Node.js version
const requiredNodeVersion = '20.10.0';
if (process.version !== `v${requiredNodeVersion}` && !process.env.NETLIFY_CLI_SKIP_NODE_CHECK) {
  console.warn(`Warning: You're using Node.js ${process.version}, but the recommended version is v${requiredNodeVersion}`);
}

// Export some config for Netlify
module.exports = {
  // Helper function to run shell commands
  run: (cmd) => {
    console.log(`Running: ${cmd}`);
    return execSync(cmd, { stdio: 'inherit' });
  },
  
  // Basic info about the project
  projectInfo: {
    name: 'LingoBabe AI',
    description: 'AI language learning platform',
    nodeVersion: process.version,
  }
}; 