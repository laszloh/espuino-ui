
export interface Tag {
  id: string;
  command: number;
  pathOrUrl: string;
}

export interface Tags {
  tags: Array<Tag>;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
