import { Server, Socket } from 'socket.io';
import { IChatMessage } from '../model/ChatMessage';
import { IProduct } from '../model/Product';
import { EChatMessage, EProductMessage } from '../types/websockets';
import chatManager from './Chat';
import products from './Products';

export const clientSocketReceiver = (
  client: Socket,
  server: Server,
  messageType: EProductMessage.client | EChatMessage.client
): void => {
  if (messageType === EProductMessage.client) {
    client.on(EProductMessage.client, (product: IProduct) => {
      product.price = Number(product.price);
      products.AddProduct(product);
      server.emit(EProductMessage.server, { products: products.GetProducts });
    });
  } else if (messageType === EChatMessage.client) {
    client.on(EChatMessage.client, async (message: IChatMessage) => {
      await chatManager.Save(message);
      const messages = await chatManager.GetMessages;
      server.emit(EChatMessage.server, { messages });
    });
  }
};
