import { ChatSession, ChatMessage } from '../types';
import { StorageService } from './storageService';

export class ChatService {
  static getChats(): ChatSession[] {
    return StorageService.getChats();
  }

  static getActiveChat(): ChatSession {
    const chats = this.getChats();
    const activeId = StorageService.getActiveChatId();
    const found = chats.find(c => c.id === activeId);
    if (found) return found;

    if (chats.length > 0) {
      StorageService.setActiveChatId(chats[0].id);
      return chats[0];
    }

    return this.createNewChat();
  }

  static setActiveChat(id: string): void {
    StorageService.setActiveChatId(id);
  }

  static createNewChat(title: string = 'Yangi seans', projectId: string = 'proj_jarvis'): ChatSession {
    const chats = this.getChats();
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      projectId,
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          sender: 'jarvis',
          text: `Yangi seans boshlandi, ser. Lokal agent tayyor.\n\nQanday buyruq bajaramiz? (Masalan: "Chrome och", "Notepad och", "Downloads papkasini och", "Kompyuterni blokla")`,
          timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now(),
          status: 'info',
        }
      ],
    };

    const updated = [newChat, ...chats];
    StorageService.saveChats(updated);
    StorageService.setActiveChatId(newChat.id);
    return newChat;
  }

  static getRecentChats(limit: number = 3): ChatSession[] {
    const chats = this.getChats().filter(c => !c.isArchived);
    return chats.slice(0, limit);
  }

  static renameChat(id: string, newTitle: string): void {
    const chats = this.getChats();
    const target = chats.find(c => c.id === id);
    if (target) {
      target.title = newTitle.trim() || 'Nomsiz chat';
      target.updatedAt = Date.now();
      StorageService.saveChats(chats);
    }
  }

  static deleteChat(id: string): void {
    let chats = this.getChats();
    chats = chats.filter(c => c.id !== id);
    if (chats.length === 0) {
      const fresh = this.createNewChat();
      return;
    }
    StorageService.saveChats(chats);
    if (StorageService.getActiveChatId() === id) {
      StorageService.setActiveChatId(chats[0].id);
    }
  }

  static archiveChat(id: string): void {
    const chats = this.getChats();
    const target = chats.find(c => c.id === id);
    if (target) {
      target.isArchived = !target.isArchived;
      StorageService.saveChats(chats);
    }
  }

  static clearChat(id: string): void {
    const chats = this.getChats();
    const target = chats.find(c => c.id === id);
    if (target) {
      target.messages = [];
      target.updatedAt = Date.now();
      StorageService.saveChats(chats);
    }
  }

  static addMessage(chatId: string, message: ChatMessage): void {
    const chats = this.getChats();
    const target = chats.find(c => c.id === chatId);
    if (target) {
      target.messages.push(message);
      target.updatedAt = Date.now();

      // Auto-title chat on first user command if it still has default title
      if (
        message.sender === 'user' &&
        (target.title === 'Yangi seans' || target.title === 'Yangi chat') &&
        target.messages.filter(m => m.sender === 'user').length === 1
      ) {
        let shortTitle = message.text.trim();
        if (shortTitle.length > 25) shortTitle = shortTitle.slice(0, 22) + '...';
        target.title = shortTitle;
      }

      StorageService.saveChats(chats);
    }
  }
}
