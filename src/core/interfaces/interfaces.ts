export interface IColData {
  title: string;
  id: string;
  order: number;
}

export interface ITaskData extends IColData {
  done: boolean;
  description: string;
  userId: string;
  files: { filename: string; fileSize: number }[];
  boardId: string;
  columnId: string;
}

export interface ITaskCreated {
  title: string;
  description: string;
  order: number;
  userId: string;
}

export interface ITaskEdited {
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}
