import { Client } from 'basic-ftp';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar credenciales desde .env.deploy
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.deploy') });

const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_SECURE,
    REMOTE_DIR
} = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
    console.error('❌ Faltan credenciales en .env.deploy. Por favor configúralas.');
    process.exit(1);
}

async function deploy() {
    console.log('🚀 Iniciando despliegue automatizado...');

    // 1. Construir el proyecto
    console.log('\n📦 1. Compilando proyecto (npm run build)...');
    try {
        execSync('npm run build', { stdio: 'inherit' });
    } catch (err) {
        console.error('❌ Falló la compilación. Despliegue abortado.');
        process.exit(1);
    }

    // 2. Conectar al FTP y subir archivos
    console.log(`\n🌐 2. Conectando a FTP: ${FTP_HOST}...`);
    const client = new Client();
    
    // Descomentar para ver logs detallados del FTP si algo falla
    // client.ftp.verbose = true;

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: FTP_SECURE === 'true' // Usar true si tu cPanel requiere FTPS implícito
        });
        
        console.log('✅ Conectado exitosamente.');
        
        // Mover a la carpeta remota (ej: public_html)
        if (REMOTE_DIR) {
            console.log(`📂 Navegando a directorio remoto: ${REMOTE_DIR}`);
            await client.cd(REMOTE_DIR);
        }

        // Subir contenido de /dist (Archivos compilados de React)
        console.log('📤 Subiendo archivos de la aplicación (Frontend)...');
        await client.uploadFromDir('dist');

        // Subir contenido de /public/backend (Archivos PHP del Backend)
        // NOTA: Esto se asegura de que cualquier cambio en PHP también suba
        console.log('📤 Subiendo archivos del servidor (Backend)...');
        // Usamos ensureDir para no fallar si no existe
        await client.ensureDir('backend'); 
        await client.uploadFromDir('public/backend');
        
        // Volver al directorio raíz remoto para evitar problemas si se corre de nuevo
        await client.cd('..');

        console.log('\n✨ ¡DESPLIEGUE COMPLETADO CON ÉXITO! ✨');
        console.log('La nueva versión ya está en producción.');

    } catch (err) {
        console.error('❌ Error durante la transferencia FTP:', err);
    } finally {
        client.close();
    }
}

deploy();
