import { IQueryAddPost, IQueryListPost } from "../interface/common";

export class QueryAddPost implements IQueryAddPost {
    errorMessage: string;
    memento: IQueryAddPost | undefined;
    constructor(values?:Partial<IQueryAddPost>){
        this.errorMessage = values?.errorMessage ?? '';
        this.memento = undefined
    }
}

export class QueryListPost implements IQueryListPost {
    errorMessage: string;
    memento: IQueryAddPost | undefined;
    offset: number;
    constructor(values?:Partial<IQueryListPost>){
        this.errorMessage = values?.errorMessage ?? '';
        this.memento = undefined;
        this.offset = values?.offset ?? 0;
    }
}