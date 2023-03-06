
export interface Tag {
  id: string;
  cmd: string;
}

export interface Tags {
  tags: Array<Tag>;
  total: number;
}
