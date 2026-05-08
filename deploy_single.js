import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.deploy') });

const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_SECURE,
    REMOTE_DIR
} = process.env;

async function deploySingle() {
    const client = new Client();
    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: FTP_SECURE === 'true'
        });
        
        if (REMOTE_DIR) {
            await client.cd(REMOTE_DIR);
        }

        await client.ensureDir('backend'); 
        await client.uploadFrom('public/backend/test_api_output.php', 'test_api_output.php');
        
        console.log('✅ Uploaded test_api_output.php');

    } catch (err) {
        console.error('❌ Error', err);
    } finally {
        client.close();
    }
}
deploySingle();
