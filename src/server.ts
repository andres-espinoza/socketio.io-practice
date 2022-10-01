import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { create } from 'express-handlebars';
import { clientSocketReceiver } from './controller/clientSocketReceiver';
import prods from './controller/Products';
import { EChatMessage, EProductMessage } from './types/websockets';
import chatManager from './controller/Chat';

const app = express();
const httpServer = createServer(app);
const socketServer = new Server(httpServer, {});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: path.join(__dirname, '/public')
});

app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', (_req, res) => res.render('index.hbs', { products: prods.GetProducts }));

socketServer.on('connection', (client: Socket) => {
  socketServer.emit(EProductMessage.server, { products: prods.GetProducts });
  chatManager.GetMessages.then((messages) => socketServer.emit(EChatMessage.server, { messages }));
  clientSocketReceiver(client, socketServer, EProductMessage.client);
  clientSocketReceiver(client, socketServer, EChatMessage.client);
});

socketServer.on('disconnect', () => {
  socketServer.removeAllListeners();
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Http Server listening port: http://localhost:${PORT}`);
});
