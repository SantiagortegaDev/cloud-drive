export interface FileItem {
  id: string;
  name: string;
  modified: string;
  type: string;
  size: string;
  icon: string;
  isFolder?: boolean;
  url?: string;
  folderId?: string | null;
}

export interface FolderContent {
  files: FileItem[];
  subfolders?: Record<string, FolderContent>;
}

export type FolderStructure = Record<string, Record<string, FolderContent>>;
