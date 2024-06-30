import { IResAddPost, IResRegister } from "./request.type";

interface IMemento<T> {
  memento?: T;
}
export interface IRegisterInputs {
  username: string;
  email: string;
  password: string;
}

export interface IDataRegister extends IMemento<IDataRegister> {
  errorMessage?: string;
  memento?: IDataRegister;
  data: IResRegister | null;
}
export interface IPost extends IMemento<IPost> {
  errorMessage?: string;
  memento?: IPost;
  data?: IResAddPost | null;
}
interface IPageMetadata {
  offset: number;
}
export interface IListPost extends IMemento<IListPost>, IPageMetadata {
  errorMessage?: string;
  memento?: IListPost;
  data: INoteUser | null;
}
export interface INoteUser{
  message: string;
  countRecord: number;
  data?: IResAddPost[]
}
export interface ILogin {
  email: string;
  password: string;
}
export interface IAddPost {
  title: string;
  content: string;
}
