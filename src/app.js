const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const fs = require('fs');
const handlebars = require('handlebars');



const server = http.createServer((req, res) => 
{
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  const url = req.url;
  const filePath = path.join(conf.root,url);

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
  })
  
  
  // res.write(Buffer.from(filePath));
  // res.end();
});

server.listen(conf.PROT, conf.HOST_NAME, () => {
  console.info(`${chalk.green(`Server running at http://${conf.HOST_NAME}:${conf.PROT}/`)}`);
});