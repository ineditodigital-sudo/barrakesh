import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.deploy') });

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_SECURE, REMOTE_DIR } = process.env;

async function deployBackend() {
    const client = new Client();
    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: FTP_SECURE === 'true'
        });
        
        if (REMOTE_DIR) await client.cd(REMOTE_DIR);
        await client.ensureDir('backend');
        
        const backendFiles = [
            ['public/backend/api.php', 'api.php'],
            ['public/backend/admin_api.php', 'admin_api.php'],
            ['public/backend/auth.php', 'auth.php'],
            ['public/backend/restore_matriz.php', 'restore_matriz.php'],
            ['public/backend/list_branches.php', 'list_branches.php'],
            ['public/backend/fix_matriz_v2.php', 'fix_matriz_v2.php'],
            ['public/backend/migrate_barbers_auth.php', 'migrate_barbers_auth.php'],
        ];
        
        for (const [local, remote] of backendFiles) {
            await client.uploadFrom(local, remote);
            console.log(`✅ Uploaded ${remote}`);
        }

    } catch (err) {
        console.error('❌ Error', err);
    } finally {
        client.close();
    }
}
deployBackend();
