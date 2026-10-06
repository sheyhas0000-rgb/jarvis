import { CommandLog } from '../types';

type LogListener = (logs: CommandLog[]) => void;

const LOGS_STORAGE_KEY = 'jarvis_command_logs_v1';
const MAX_LOGS = 100;

export class LogService {
  private static logs: CommandLog[] = [];
  private static listeners: Set<LogListener> = new Set();
  private static initialized: boolean = false;

  private static init(): void {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const data = localStorage.getItem(LOGS_STORAGE_KEY);
      if (data) {
        this.logs = JSON.parse(data);
      }
    } catch (e) {
      this.logs = [];
    }

    if (this.logs.length === 0) {
      this.addLog('SYSTEM_BOOT', 'info', 'JARVIS Local Desktop Agent v1.5 initialized. 100% Offline mode.');
    }
  }

  static getLogs(): CommandLog[] {
    this.init();
    return [...this.logs];
  }

  static addLog(command: string, status: 'success' | 'error' | 'info', details?: string, category?: string): CommandLog {
    this.init();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newLog: CommandLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      timeFormatted,
      command,
      status,
      details,
      category,
    };

    this.logs = [newLog, ...this.logs].slice(0, MAX_LOGS);

    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {}

    this.notify();
    return newLog;
  }

  static clearLogs(): void {
    this.logs = [];
    try {
      localStorage.removeItem(LOGS_STORAGE_KEY);
    } catch (e) {}
    this.notify();
  }

  static subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(): void {
    const current = [...this.logs];
    this.listeners.forEach(fn => fn(current));
  }
}
