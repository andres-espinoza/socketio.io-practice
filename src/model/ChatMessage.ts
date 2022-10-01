export interface IChatMessage {
  email: string;
  message: string;
  dateTime: string;
}

class ChatMessage {
  email: string;

  message: string;

  dateTime: string;

  readonly id: number;

  constructor(chatMessage: IChatMessage, id: number) {
    this.email = chatMessage.email;
    this.message = chatMessage.message;
    this.dateTime = chatMessage.dateTime;
    this.id = id;
  }
}

export default ChatMessage;
