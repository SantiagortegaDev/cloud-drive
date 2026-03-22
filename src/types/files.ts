export interface FileItem {
  name: string;
  modified: string;
  type: string;
  size: string;
  icon: string;
  isFolder?: boolean;
}

export interface FolderContent {
  files: FileItem[];
  subfolders?: Record<string, FolderContent>;
}

export type FolderStructure = Record<string, Record<string, FolderContent>>;
