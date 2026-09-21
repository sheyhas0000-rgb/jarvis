export type ApprovedLocation = 'Desktop' | 'Documents' | 'Downloads' | 'Pictures' | 'Videos';

export type SidebarTab = 
  | 'chat'
  | 'settings'
  | 'all_chats'
  | 'recent_chats'
  | 'plugins'
  | 'projects'
  | 'updates'
  | 'profile';

export type PermissionType = 
  | 'application_launch'
  | 'file_access'
  | 'file_delete'
  | 'browser_control'
  | 'windows_commands'
  | 'system_settings'
  | 'automation';

export interface PermissionRule {
  enabled: boolean;
  requireConfirmation: boolean;
  label: string;
  description: string;
}

export type PermissionSettings = Record<PermissionType, PermissionRule>;

export interface PendingPermission {
  id: string;
  commandText: string;
  permissionType: PermissionType;
  actionTitle: string;
  details: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type CommandCategory = 
  | 'applications'
  | 'windows'
  | 'files'
  | 'browser'
  | 'system'
  | 'automation';

export interface LocalCommandDefinition {
  id: string;
  name: string;
  category: CommandCategory;
  pluginId: string;
  keywords: string[];
  description: string;
  example: string;
  requiresPermission: PermissionType;
  dangerous?: boolean;
}

export interface LocalPlugin {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'disabled';
  enabled: boolean;
  version: string;
  icon: string;
  category: string;
  commandsCount: number;
  guide: string;
  settings?: Record<string, boolean | string | number>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: number;
}

export interface AppSettings {
  agentName: string;
  language: 'uz_lat' | 'uz_kir' | 'en';
  theme: 'dark' | 'light';
  animations: boolean;
  soundEnabled: boolean;
  showTimestamps: boolean;
  notifications: boolean;
  defaultLocation: ApprovedLocation;
  permissions: PermissionSettings;
}

export interface SafeAction {
  action: string;
  [key: string]: any;
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  sizeFormatted?: string;
  modifiedAt?: string;
  location?: ApprovedLocation;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timeFormatted: string;
  timestamp: number;
  status?: 'success' | 'error' | 'pending' | 'info';
  action?: SafeAction;
  isRealWindows?: boolean;
  fileItems?: FileItem[];
  createdFile?: {
    name: string;
    content?: string;
    size?: number;
    location: ApprovedLocation;
  };
  webLink?: {
    title: string;
    url: string;
    iconType: string;
  };
  commandDetails?: {
    commandId?: string;
    category?: CommandCategory;
    permissionUsed?: PermissionType;
    windowsCommand?: string;
    executedAt?: string;
  };
  pendingConfirmation?: {
    action: SafeAction;
    message: string;
    type: 'delete' | 'create' | 'open' | 'rename' | 'shutdown' | 'restart' | 'system';
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  projectId?: string;
  isArchived?: boolean;
}

export interface CommandExecutionResult {
  success: boolean;
  message: string;
  details?: string;
  windowsCommand?: string;
  createdFile?: {
    name: string;
    content?: string;
    size?: number;
    location: ApprovedLocation;
  };
  fileItems?: FileItem[];
  webLink?: {
    title: string;
    url: string;
    iconType: string;
  };
  speechText?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permissionType?: PermissionType;
}

export interface ParseResult {
  recognized: boolean;
  commandId?: string;
  category?: CommandCategory;
  pluginId?: string;
  title?: string;
  args?: Record<string, any>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  permissionType?: PermissionType;
  unrecognizedReason?: string;
  suggestedCommands?: string[];
}
