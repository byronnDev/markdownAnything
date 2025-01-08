const setup = require('./setup.cjs');
const { startServer } = require('./node.cjs');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m'
};

function clearConsole() {
    process.stdout.write('\x1Bc');
}

function showBanner() {
    console.log(`${colors.cyan}
    ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗██████╗  ██████╗ ██╗    ██╗███╗   ██╗
    ████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗██╔═══██╗██║    ██║████╗  ██║
    ██╔████╔██║███████║██████╔╝█████╔╝ ██║  ██║██║   ██║██║ █╗ ██║██╔██╗ ██║
    ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██║  ██║██║   ██║██║███╗██║██║╚██╗██║
    ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗██████╔╝╚██████╔╝╚███╔███╔╝██║ ╚████║
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
                        ${colors.yellow}Convierte cualquier archivo a Markdown${colors.reset}
    `);
}

async function start() {
    try {
        clearConsole();
        showBanner();

        console.log(`${colors.blue}⚡ Iniciando configuración...${colors.reset}\n`);
        await setup();

        console.log(`\n${colors.magenta}🚀 Iniciando servidor...${colors.reset}`);
        const { port } = await startServer();
        
        const url = `http://localhost:${port}`;
        console.log(`\n${colors.green}✨ Servidor listo en: ${colors.bright}${url}${colors.reset}`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const open = (await import('open')).default;
        console.log(`\n${colors.cyan}🌐 Abriendo navegador...${colors.reset}`);
        await open(url);

        console.log(`\n${colors.yellow}📝 La aplicación está lista para usar!${colors.reset}\n`);

    } catch (error) {
        console.error(`\n${colors.red}❌ Error al iniciar la aplicación:${colors.reset}`, error);
        process.exit(1);
    }
}

process.on('unhandledRejection', (err) => {
    console.error(`\n${colors.red}❌ Error no manejado:${colors.reset}`, err);
});

start();