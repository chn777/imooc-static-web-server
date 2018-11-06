const yargs = require('yargs');
const Server = require('./app');
const argv = yargs
    .usage('anywhere [option]')
    .option('p',{alias:'PROT',describe:"端口号",default:8090})
    .option('h',{alias:'HOST_NAME',describe:"hostName",default:'127.0.0.1'})
    .version()
    .alias('v','version')
    .help()
    .argv

const server = new Server(argv);
server.start();
