require("dotenv").config();

const app = require("./server");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const log = require('node-file-logger');
app.set("view engine", "ejs");

const PORT = process.env.PORT || 1401;

const options = {
  folderPath: './logs/',
  dateBasedFileNaming: true,
  fileNamePrefix: 'DailyLogs_',
  fileNameExtension: '.log',    
  dateFormat: 'YYYY_MM_D',
  timeFormat: 'h:mm:ss A',
}
log.SetUserOptions(options);

server.listen(PORT, () => {
  const buddhaArt = `
               _oo0oo_
              o8888888o
              88" . "88
              (| -_- |)
              0\\  =  /0
           ___/\\'---'/\\___
         .' \\\\|     |// '.
        / \\\\|||  :  |||// \\
       / _||||| -:- |||||- \\
      |   | \\\\\\  -  /// |   |
      | \\_|  ''\\---/''  |_/ |
      \\  .-\\__  '-'  ___/-. /
    ___'. .'  /--.--\\  '. .'___
 ."" '<  '.___\\_<|>_/__.' >' "".
| | :  '- \\'.;\\ _ /';.'/ - ' : | |
\\  \\ '_.   \\_ __\\ /__ _/   .-' /  /
 ======'-.____'.___\\_____/___.-'=====

 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          Buddha Blessing You
`;

  console.log(buddhaArt);

  console.log("server running.., port :" + PORT);
  log.Info("run server thanh cong");
});

// socker io feature

io.on("connection", (socket) => {
  console.log("user connected....:", socket.id);

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("message", data);
  });
});

// websocket

//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// shut down server
function shutdown() {
  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}
//
// need above in docker container to properly exit
//
