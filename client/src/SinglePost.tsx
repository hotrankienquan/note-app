import { CiEdit } from "react-icons/ci";
import { create } from "zustand";

interface IItem {
  id: number;
  title: string;
  content: string;
}
export interface IUpdatePost {
  title: string;
  content: string;
}

export interface IPostStore {
  dataPost: IUpdatePost | null;
  updatePost: (post: IUpdatePost) => void;
}

export const useUpdatePost = create<IPostStore>((set) => ({
  dataPost: null,
  updatePost: (post) => set(() => ({ dataPost: post })),
}));

export function SinglePost(item: IItem) {
  return (
    <div key={item.id} className="p-2 m-2 border-b-2 border-solid min-h-[200px] flex items-center justify-between">
      <div>
        <p>tiêu đề : {item.title}</p>
        <p dangerouslySetInnerHTML={{ __html: `nội dung: ${item.content}` }} />
      </div>
      <div className="cursor-pointer text-4xl">
        <CiEdit />
      </div>
    </div>
  );
}