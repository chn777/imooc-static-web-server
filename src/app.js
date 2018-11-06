const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const fs = require('fs');
const handlebars = require('handlebars');
const openurl = require('./openurl');

class Server {
  constructor(config){
    this.conf = Object.assign({},conf,config);
  }

  start()
  {

    const tplPath = path.join(this.conf.root,'/src/template/dir.tpl');
    console.log(tplPath)
    const tplSource = fs.readFileSync(tplPath);
    const tpl = handlebars.compile(tplSource.toString());
    const server = http.createServer((req, res) => 
    {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const url = req.url;
      const filePath = path.join(this.conf.root,url);

      fs.stat(filePath,(error,stats) => {
        if(error){
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.write(Buffer.from("not a good http request"));
          res.end();
          return;
        }
        else
        {
          if(stats.isFile())
          {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            fs.createReadStream(filePath).pipe(res);
          }
          else if(stats.isDirectory())
          {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.readdir(filePath,(err,fileNames) => {
              for(let file of fileNames)
              {
                res.write(Buffer.from(`
                  <li><a href="${path.join(url,file)}">${file}</a></li>
                `));
              }
            });
          }

        }
      });
    });

    server.listen(this.conf.PROT, this.conf.HOST_NAME, () => 
    {
      console.info(`${chalk.green(`Server running at http://${this.conf.HOST_NAME}:${this.conf.PROT}/`)}`);
      openurl(`http://${this.conf.HOST_NAME}:${this.conf.PROT}`);
    });
  }
}

module.exports = Server;

