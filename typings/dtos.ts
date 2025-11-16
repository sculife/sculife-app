import { Sex } from "./interfaces";

export type UserDTO = {
  uid: string;
  id: string;
  name: string;
  bio: string;
  sex: Sex;
  class: string;
  cname: string;
  departments: string[];
};

export type UserLoginDTO = string;

export type UserRegisterDTO = string;
