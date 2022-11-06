const fs = require("fs");
const http = require("http");
const { json } = require("stream/consumers");

const server = http.createServer((req, res) => {
  if (req.url === "/message" && req.method === "POST") {
    // const body = [];

    // req.on("data",chunk => {
    //     body.push(chunk);
    // });
    // req.on("end",() => {
    //     const parsedBody = Buffer.concat(body).toString();
    // })
    fs.writeFileSync("../data/users.json",JSON.stringify({id:1}));
  }
});

server.listen(
  3000,
  "https://mpeymanrad.github.io"
);
