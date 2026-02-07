import { db } from '../config/firebase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function clearDatabase() {    
    try {
        const collectionsToDelete = [
            'applicants',
            'attendance', 
            'balances',
            'corporatecalendar',
            'generaterequests',
            'interviewinsights',
            'leaves',
            'notices',
            'recruitment',
            'salaries'
        ];

        for (const collectionName of collectionsToDelete) {            
            const collectionRef = db.collection(collectionName);
            const snapshot = await collectionRef.get();
            
            if (!snapshot.empty) {
                const batch = db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        }

        const essentialCollections = [
            'employees',
            'humanresources', 
            'departments',
            'organizations'
        ];

        for (const collectionName of essentialCollections) {            
            const collectionRef = db.collection(collectionName);
            const snapshot = await collectionRef.get();
            
            if (!snapshot.empty) {
                const batch = db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        }

        
    } catch (error) {
        throw error;
    }
}

clearDatabase()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });