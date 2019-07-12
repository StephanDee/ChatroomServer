const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 8080 });

// List of connections
let clients = [];

// Connection listener
wss.on("connection", connection => {
  clients.push(connection);
  broadcast({
    username: "Admin",
    message: "Ein Nutzer ist dem Chat beigetreten."
  });

  // Message listener
  connection.on("message", message => {
    const data = JSON.parse(message);
    broadcast(data);
  });
});

/**
 * Send data to each client.
 *
 * @param message The message {username, message}
 */
function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => client.send(data));
}

// The chatroom wont close with this workaround
setInterval(clean, 100);

/**
 * Remove client from list and broadcast that a client has left when the client closed the connection.
 */
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
