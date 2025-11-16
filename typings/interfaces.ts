export type Sex = "MALE" | "FEMALE";

export type User = {
  bio: string;
  class: string;
  cname: string | null;
  id: string;
  name: string;
  sex: Sex;
  uid: string;
};
