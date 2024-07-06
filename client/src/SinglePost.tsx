import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { create } from "zustand";
import Modal from "./components/Modal";
import { EditPost } from "./EditPost";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  function closeModal(){
    setIsModalOpen(false)
  }
  return (
    <div key={item.id} className="p-2 m-2 border-b-2 border-solid min-h-[200px] flex items-center justify-between">
      <div>
        <p>tiêu đề : {item.title}</p>
        <p dangerouslySetInnerHTML={{ __html: `nội dung: ${item.content}` }} />
      </div>
      <div className="cursor-pointer text-4xl">
        <CiEdit onClick={toggleModal}/>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <EditPost content={item.content} title={item.title} closeModal={closeModal}/>
      </Modal>
    </div>
  );
}