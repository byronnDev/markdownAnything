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
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝
                        ${colors.yellow}Convert any file to Markdown${colors.reset}
    `);
}

async function start() {
    try {
        clearConsole();
        showBanner();

        console.log(`${colors.blue}⚡ Setting up environment...${colors.reset}`);
        await setup();

        console.log(`${colors.magenta}🚀 Starting server...${colors.reset}`);
        const { port } = await startServer();
        
        const url = `http://localhost:${port}`;
        console.log(`\n${colors.green}✨ Server ready at: ${colors.bright}${url}${colors.reset}`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const open = (await import('open')).default;
        console.log(`\n${colors.cyan}🌐 Opening browser...${colors.reset}`);
        await open(url);

        console.log(`\n${colors.yellow}📝 The application is ready to use!${colors.reset}\n`);

    } catch (error) {
        console.error(`\n${colors.red}❌ Error starting the application:${colors.reset}`, error);
        process.exit(1);
    }
}

process.on('unhandledRejection', (err) => {
    console.error(`\n${colors.red}❌ Unhandled error:${colors.reset}`, err);
});

startServer()
    .catch(error => {
        console.error('Error starting the server:', error);
    });

start();