export type FileSystemItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  language?: string;
  isOpen?: boolean;
};

export type LogEntry = {
  type: 'log' | 'error' | 'warn';
  message: string;
  timestamp: string;
};

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  isLocal?: boolean;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export type AppSettings = {
  theme: 'dark' | 'light';
  fontSize: number;
  aiProvider: string;
  aiModel: string;
  apiKeys: Record<string, string>;
};