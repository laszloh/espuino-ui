
export interface Tag {
  id: string;
  command: number;
  pathOrUrl: string;
}

export interface Tags extends Array<Tag>{}