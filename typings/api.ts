export type PostApiObject = {
  postId: string;
  authorUid: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  departmentId: string | null;
};

export type PostApiResponseBody = PostApiObject[];

export type Post = PostApiObject & {
  author: string;
  time: string; // TODO: temp
  departmentName: string | null;
};
