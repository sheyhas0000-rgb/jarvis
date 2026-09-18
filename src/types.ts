export type ApprovedLocation = 'Desktop' | 'Documents' | 'Downloads' | 'Pictures' | 'Videos';

export interface LocationInfo {
  id: ApprovedLocation;
  uzbekName: string;
  aliases: string[];
  icon: string;
  defaultEnabled: boolean;
}

export type SafeActionType = 
  | 'create_file'
  | 'create_folder'
  | 'list_files'
  | 'open_file'
  | 'open_folder'
  | 'rename_file'
  | 'delete_file'
  | 'open_website'
  | 'open_download_modal';

export interface CreateFileAction {
  action: 'create_file';
  location: ApprovedLocation;
  name: string;
  content: string;
}

export interface CreateFolderAction {
  action: 'create_folder';
  location: ApprovedLocation;
  name: string;
}

export interface ListFilesAction {
  action: 'list_files';
  location: ApprovedLocation;
}

export interface OpenFileAction {
  action: 'open_file';
  location: ApprovedLocation;
  name: string;
}

export interface OpenFolderAction {
  action: 'open_folder';
  location: ApprovedLocation;
}

export interface RenameFileAction {
  action: 'rename_file';
  location: ApprovedLocation;
  oldName: string;
  newName: string;
}

export interface DeleteFileAction {
  action: 'delete_file';
  location: ApprovedLocation;
  name: string;
}

export interface OpenWebsiteAction {
  action: 'open_website';
  title: string;
  url: string;
  iconType: 'instagram' | 'youtube' | 'facebook' | 'telegram' | 'google' | 'tiktok' | 'chatgpt' | 'github' | 'web';
}

export interface OpenDownloadModalAction {
  action: 'open_download_modal';
  targetPlatform?: 'windows' | 'mac' | 'android';
}

export type SafeAction =
  | CreateFileAction
  | CreateFolderAction
  | ListFilesAction
  | OpenFileAction
  | OpenFolderAction
  | RenameFileAction
  | DeleteFileAction
  | OpenWebsiteAction
  | OpenDownloadModalAction;

export interface ParseResult {
  recognized: boolean;
  action?: SafeAction;
  intentDescription?: string;
  error?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  source: 'local_parser' | 'ai_parser';
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  sizeFormatted?: string;
  modifiedAt?: string;
  extension?: string;
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  details?: string;
  items?: FileItem[];
  path?: string;
  isRealWindows: boolean;
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
}

export interface ActionLogItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  command: string;
  summary: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  response: string;
  action?: SafeAction;
  isRealWindows: boolean;
  webLink?: {
    title: string;
    url: string;
    iconType: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timeFormatted: string;
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
  pendingConfirmation?: {
    action: SafeAction;
    message: string;
    type: 'delete' | 'create' | 'open' | 'rename';
  };
}

export interface AgentStatusInfo {
  connected: boolean;
  url: string;
  username: string;
  hostname: string;
  platform: string;
  platformName?: string;
  homeDir?: string;
  version: string;
  allowedPaths: Record<ApprovedLocation, string>;
  lastChecked: number;
}
