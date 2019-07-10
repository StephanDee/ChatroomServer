const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8080 });
let clients = [];

wss.on("connection", connection => {
  clients.push(connection);
  broadcast({
    username: "Admin",
    message: "Ein Nutzer ist dem Chat beigetreten."
  });

  connection.on("message", message => {
    const data = JSON.parse(message);
    broadcast(data);
  });
});

function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => client.send(data));
}

// The chatroom wont close with this workaround
setInterval(clean, 100);

function clean() {
  const clientsLeaving = clients.filter(
    client => client.readyState === client.CLOSED
  );
  clients = clients.filter(client => client.readyState !== client.CLOSED);
  clientsLeaving.forEach(client => {
    broadcast({
      username: "Admin",
      message: "Ein Nutzer hat den Chat verlassen."
    });
  });
}
