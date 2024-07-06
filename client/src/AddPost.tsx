/* eslint-disable react-refresh/only-export-components */
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { http } from "./http/make-request";
import { IApiResponse, IResAddPost } from "./interface/request.type";
import classNames from "classnames";
import axios, { AxiosError } from "axios";
import { addPostSchema } from "./schema/schema-validate-form";
import { IAddPost, IQueryAddPost } from "./interface/common";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";
import { useState } from "react";
import { QueryAddPost } from "./utils/class";
import {create} from 'zustand'
import { Editor } from "./Jodit-Editor";
// Define the interface for the store's state
interface IDataStore {
  dataPost: Array<IResAddPost>;
  addPost: (singleItem: IResAddPost) => void;
}

// Create Zustand store
export const useStorePost = create<IDataStore>((set) => ({
  dataPost: [],
  addPost: (singleItem) =>
    set((state) => ({
      dataPost: [...state.dataPost, singleItem],
    })),
}));

const AddPost = () => {

  const [query, setQuery] = useState<IQueryAddPost>(new QueryAddPost())
  const [contentJodit, setContentJodit] = useState<string>('');
  const {addPost} = useStorePost();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IAddPost>({
    resolver: yupResolver(addPostSchema),
  });
  const onSubmit: SubmitHandler<IAddPost> = async (data) => {
    const submitData = {
      ...data,
      content: contentJodit
    }
    setQuery(prev=>({...prev, memento: new QueryAddPost()}))
    try {
      const result = await http.post<IAddPost, IApiResponse<IResAddPost>>("/add-note", {
        ...submitData,
      },  {
        headers: {
          "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
          "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
        },
      });
      if(result.status !== 200){
        throw new Error("fetch failed")
      }
      
      setQuery(prev=>({...prev, memento: undefined}))
      addPost(result.metadata)
      reset({
        title:"",
      })
      
    } catch (error) { /* empty */
      const errors = error as AxiosError<{
        code: number;
        message: string;
        stack: string;
        status: string;
      }>;
      if(!axios.isAxiosError(error)){
        // do whatever you want with native error
        console.log('native error', errors);
        
      }
      if(errors.message === 'fetch failed'){
        setQuery(prev=>({...prev, memento: prev.memento, errorMessage: "co loi xay ra"}))
      }
      
     }
  };
  function getContent(values: string){
      console.log(values);
      setContentJodit(values)
  }
  return (
    <div className="font-sans antialiased bg-grey-lightest">
      <div className="w-full bg-grey-lightest" style={{ paddingTop: "4rem" }}>
        <div className="container mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="py-4 px-8">
                <div className="mb-4">
                  <label
                    className="block text-grey-darker text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Tiêu đề
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    type="text"
                    {...register("title", { required: true })}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-grey-darker text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Nội dung
                  </label>
                  {/* <textarea
                  className="border-[1px] border-solid border-gray-100 w-full min-h-[120px]"
                  {...register("content", { required: true })}
                  ></textarea> */}
                  <Editor getContent={getContent}/>
                </div>
                <div>
                  {errors.title && <p>{errors.title.message}</p>}
                  {query.errorMessage && <p>{query.errorMessage}</p>}
                </div>
                <div className="flex items-center justify-between mt-8">
                  <button
                    disabled={!!query.memento}
                    className={classNames("mx-auto border-[1px] border-[#ccc] border-solid opacity-100 hover:opacity-70 cursor-pointer text-[#333] font-bold py-2 px-4 rounded-sm",{
                      "bg-gray-200": Boolean(query.memento)
                    })}
                    type="submit"
                  >
                    {(query.memento) ? "loading..." : "thêm bài"}
                  </button>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
