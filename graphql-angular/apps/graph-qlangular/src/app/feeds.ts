export interface Feeds {
  id?: string;
  url?: string;
  description?: string;
  comments?: Comment[];
}

export interface Comment {
  id?: string;
  body?: string;
}
