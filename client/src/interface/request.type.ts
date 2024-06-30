import { Role } from "../enums/common";

export interface IApiResponse<T> {
    message: string;
    status: number;
    metadata: T;
    options?: Record<string, never>

}
export interface IResRegister {
    user:  IResUser,
    tokens: IToken;
}
export interface IResLogin{
    user:  IResUser,
    tokens: IToken;
}
interface IResUser {
    nameWithRole: string;
    id: string;
    hashId: string;
    username: string;
    password: string;
    email: string;
    role: Role[];
    updateTimestamp: string;
    createdAt: string;
}
interface IToken {
    accesstoken: string;
    refreshtoken: string;
}
export interface IResAddPost {
    id: number;
    title: string;
    content: string;
    userId: string;
    updateTimestamp: string;
    createdAt: string;
}