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

export type UserApiObject = {
  bio: string;
  class: string;
  cname: string;
  deptId: string | null;
  id: string;
  name: string;
  sex: string;
  uid: string;
};

export type UserLoginApiObject = UserApiObject & {
  permissions: number;
  email: string | null;
  token: string;
};

export type DepartmentApiObject = {
  name: string;
  deptId: string;
  managerUid: string;
};

export type ApiObject<T> = {
  msg: string;
  data: T;
};

export type PostApiResponseBody = PostApiObject[];

export type Department = DepartmentApiObject;

export type User = UserApiObject & {
  department: Department | null;
};

export type Post = PostApiObject & {
  author: User | null;
  department: Department | null;
};
