import { io } from 'socket.io-client';
import { EChatMessage, EProductMessage } from '../types/websockets';

//* ----------------------------- Products ---------------------------------------------
interface IClientProduct {
  title: string;
  price: string;
  thumbnail: string;
}
const clientSocket = io();

const productForm = document.querySelector('#product-form') as HTMLFormElement;
const productList = document.querySelector('#product-table') as HTMLElement;

const productSubmit = (
  event: SubmitEvent,
  form: HTMLFormElement,
  socketMessage: EProductMessage
): void => {
  event.preventDefault();
  const inputsRetriever = new FormData(form) as unknown as Iterable<
  [IClientProduct, FormDataEntryValue]
  >;
  const product: IClientProduct = Object.fromEntries(inputsRetriever);
  clientSocket.emit(socketMessage, product);
  form.reset();
};

productForm.addEventListener('submit', (e) =>
  productSubmit(e, e.target as HTMLFormElement, EProductMessage.client)
);

clientSocket.on(EProductMessage.server, ({ products }: { products: IClientProduct[] }) => {
  if (products.length < 1) {
    productList.innerHTML = '<h2>There is no products yet!</h2>';
  } else {
    const productsRows = products
      .map(
        ({ title, price, thumbnail }) => `
    <tr>
      <th scope="row" class="table_product_name">${title}</th>
      <td>${price}</td>
      <td class="table_cell_image">
        <img
          class="table_image"
          src=${thumbnail}
          alt="product-image">
      </td>
    </tr>
    `
      )
      .join('');
    const html = `
    <h2>Product List</h2>
    <table>
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Price</th>
          <th scope="col">Image</th>
        </tr>
      </thead>
      <tbody>
        ${productsRows}
      </tbody>
    </table>
    `;
    productList.innerHTML = html;
  }
});

//* ----------------------------- Chat Messages ---------------------------------------------

interface IChatMessages {
  email: string;
  message: string;
  dateTime: string;
  id: string;
}

const chatForm = document.querySelector('#chat-form') as HTMLFormElement;
const messagesList = document.querySelector('#messages-table') as HTMLElement;
const chatMessageInput = document.querySelector('#chat-message') as HTMLInputElement;

const chatMessageSubmit = (
  event: SubmitEvent,
  form: HTMLFormElement,
  socketMessage: EChatMessage
): void => {
  event.preventDefault();
  const inputsRetriever = new FormData(form) as unknown as Iterable<
  [Partial<IChatMessages>, FormDataEntryValue]
  >;
  const chatMessage: Partial<IChatMessages> = Object.fromEntries(inputsRetriever);
  const dateTime = new Date;
  const dateTimeString = dateTime.toLocaleString();
  chatMessage.dateTime = dateTimeString;
  clientSocket.emit(socketMessage, chatMessage);
  chatMessageInput.value = '';
};

chatForm.addEventListener('submit', (e) =>
  chatMessageSubmit(e, e.target as HTMLFormElement, EChatMessage.client)
);

clientSocket.on(EChatMessage.server, ({ messages }: { messages: IChatMessages[] }) => {
  if (messages.length < 1) {
    messagesList.innerHTML = '<h2>There is no messages to show!</h2>';
  } else {
    const messagesRows = messages
      .map(
        ({ email, message, dateTime }) => `
    <tr>
      <td class="chat-message-row">
        <span style="color: blue"><b>${email}</b></span>
        <span style="color: red">[${dateTime}]:</span>
        <span style="color: green"><i>${message}</i></span>
      </td>
    </tr>
    `
      )
      .join('');
    const html = `
    <h2>Chat Messages</h2>
    <table class="table-messages ">
      <tbody>
        ${messagesRows}
      </tbody>
    </table>
    `;
    messagesList.innerHTML = html;
  }
});
