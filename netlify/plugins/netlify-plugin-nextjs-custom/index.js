// Custom plugin to help with Next.js deployment on Netlify
const fs = require('fs');
const path = require('path');

module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Running custom Next.js pre-build step...');
    
    // Check for required environment variables
    const requiredEnvVars = ['OPENAI_API_KEY'];
    const missingEnvVars = requiredEnvVars.filter(name => !process.env[name]);
    
    if (missingEnvVars.length > 0) {
      utils.build.failBuild(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
    
    console.log('All required environment variables are present.');
  },
  
  onBuild: ({ utils }) => {
    console.log('Running custom Next.js build verification...');
    
    // Verify build output
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      utils.build.failBuild('Next.js build directory (.next) does not exist. Build may have failed.');
      return;
    }
    
    // Check for essential Next.js build artifacts
    const requiredFiles = [
      path.join(nextDir, 'build-manifest.json'),
      path.join(nextDir, 'server', 'app-paths-manifest.json')
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    if (missingFiles.length > 0) {
      utils.build.failBuild(`Missing essential Next.js build artifacts: ${missingFiles.join(', ')}`);
      return;
    }
    
    console.log('Next.js build output verified successfully.');
  },
  
  onPostBuild: ({ utils }) => {
    console.log('Running custom Next.js post-build step...');
    
    // Ensure API routes are properly set up
    const netlifyEdgeFunctions = path.join(process.cwd(), 'netlify', 'edge-functions');
    if (!fs.existsSync(netlifyEdgeFunctions)) {
      utils.build.failBuild('Missing Netlify edge functions directory.');
      return;
    }
    
    console.log('Next.js setup for Netlify completed successfully.');
  }
}; 