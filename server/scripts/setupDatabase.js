import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    try {
        execSync('node clearDatabase.js', { 
            cwd: __dirname, 
            stdio: 'inherit' 
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        execSync('node seedData.js', { 
            cwd: __dirname, 
            stdio: 'inherit' 
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        execSync('node verifyData.js', { 
            cwd: __dirname, 
            stdio: 'inherit' 
        });
        
    } catch (error) {
        process.exit(1);
    }
}

setupDatabase();