/**
 * This script scans the frontend React components and replaces direct axios imports
 * with imports from our centralized axios instance.
 * 
 * To run: node scripts/update-axios.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const ROOT_DIR = path.resolve(__dirname, '../frontend/src');
const AXIOS_INSTANCE_PATH = '../utils/axios';

// Files that have already been updated
const UPDATED_FILES = [
  'pages/UserLogin.jsx',
  'pages/UserSignup.jsx',
  'pages/UserProtectWrapper.jsx',
  'pages/UserLogout.jsx',
  'pages/CaptainLogout.jsx',
  'pages/CaptainProtectWrapper.jsx',
  'pages/Captainlogin.jsx',
];

async function findJsxFiles(dir, fileList = []) {
  const files = await readDir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      await findJsxFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      // Get path relative to src directory
      const relativePath = path.relative(ROOT_DIR, filePath);
      fileList.push({ path: filePath, relativePath });
    }
  }
  
  return fileList;
}

async function processFile(filePath, relativePath) {
  try {
    // Skip already updated files
    if (UPDATED_FILES.includes(relativePath)) {
      console.log(`Skipping already updated file: ${relativePath}`);
      return false;
    }
    
    // Read file content
    const content = await readFile(filePath, 'utf8');
    
    // Check if this file imports axios directly
    if (!content.includes('import axios from ')) {
      return false;
    }
    
    // Update the imports - replace direct axios import with our instance
    const updatedContent = content
      .replace(/import axios from ['"]axios['"]/, `import axiosInstance from '${AXIOS_INSTANCE_PATH}'`)
      // Replace direct axios usage with axiosInstance, maintaining whitespace
      .replace(/(\s+)axios\./g, '$1axiosInstance.')
      .replace(/\${import\.meta\.env\.VITE_BASE_URL}\/api/g, '/api')
      // Add the Authorization header to get requests
      .replace(/(axiosInstance\.get\(['"].*['"]\)),\s*{\s*headers:\s*{\s*Authorization:\s*[^}]*}\s*}/g, '$1')
      // Add the Authorization header to post requests
      .replace(/(axiosInstance\.post\(['"].*['"],\s*[^,)]*),\s*{\s*headers:\s*{\s*Authorization:\s*[^}]*}\s*}/g, '$1');
    
    // Write the updated content back
    await writeFile(filePath, updatedContent);
    console.log(`Updated: ${relativePath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${relativePath}:`, error);
    return false;
  }
}

async function main() {
  try {
    const files = await findJsxFiles(ROOT_DIR);
    console.log(`Found ${files.length} JSX/JS files to check`);
    
    let updatedCount = 0;
    for (const file of files) {
      const updated = await processFile(file.path, file.relativePath);
      if (updated) updatedCount++;
    }
    
    console.log(`Updated ${updatedCount} files to use the axios instance`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 