import * as fs from 'fs';
import ChatMessage, { IChatMessage } from '../model/ChatMessage';

const thisPath = __dirname.split('\\');
thisPath.pop();
const filePathChatMessages = `${thisPath.join('/')}/public/files/chatMessages.json`;

class Chat {
  FileName: string;

  private MessageId: number = 0;

  private FilePath: string;

  constructor(fileName: string) {
    this.FileName = fileName;
    this.FilePath = filePathChatMessages;
  }

  get GetMessages(): Promise<IChatMessage[]> {
    return fs.promises
      .readFile(this.FilePath)
      .then((file: any) => JSON.parse(file))
      .then(({ chatHistory }: { chatHistory: IChatMessage[] }) => chatHistory)
      .catch((error: any) => {
        console.error(error);
        return [];
      });
  }

  private SaveJsonMessageInFile(messages: IChatMessage[]): Promise<void> {
    const chatHistoryUpdated = JSON.stringify({ chatHistory: messages });
    return fs.promises.writeFile(this.FilePath, chatHistoryUpdated, 'utf8');
  }

  async Save(message: IChatMessage): Promise<number | null> {
    try {
      const messages = await this.GetMessages;
      this.MessageId += 1;
      const newMessage = new ChatMessage(message, this.MessageId);
      messages.push(newMessage);
      await this.SaveJsonMessageInFile(messages);
      return this.MessageId;
    } catch (error: any) {
      console.error(error?.message);
      return null;
    }
  }
}

const chatManager = new Chat(filePathChatMessages);

export default chatManager;
