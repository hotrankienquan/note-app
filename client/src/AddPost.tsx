import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import { http } from "./http/make-request";
import { signal } from "@preact/signals";
import { IApiResponse, IResAddPost } from "./interface/request.type";
import classNames from "classnames";
import axios, { AxiosError } from "axios";
import { addPostSchema } from "./schema/schema-validate-form";
import { IAddPost, IPost } from "./interface/common";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";


const posts = signal<IPost>({
  errorMessage:"",
  memento: undefined,
  data: null
});


const AddPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IAddPost>({
    resolver: yupResolver(addPostSchema),
  });
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<IAddPost> = async (data) => {
    posts.value =  {
      ...posts.value,
      memento: posts.value
    }
    try {
      const result = await http.post<IAddPost, IApiResponse<IResAddPost>>("/add-note", {
        ...data,
      },  {
        headers: {
          "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
          "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
        },
      });
      if(result.status !== 200){
        //failed
        posts.value =  {
          ...posts.value,
          memento: posts.value,
          errorMessage: result.message ?? "some error occured"
        }
      }
      //succeed
      posts.value =  {
        ...posts.value,
        memento: undefined,
        errorMessage: result.message,
        data: result?.metadata
      }
      
      reset({
        title:"",
        content:"",
      })
      navigate("/")
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
      posts.value.errorMessage = errors?.response?.data?.message;
      posts.value.memento = undefined;
      // do what you want with your axios error
     }
  };
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
                  {/* <input
                    className="appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                    type="tex"
                    placeholder="Your secure password"
                    {...register("password", { required: true })}
                  /> */}
                  <textarea
                  className="border-[1px] border-solid border-gray-100 w-full min-h-[120px]"
                  {...register("content", { required: true })}
                  ></textarea>
                </div>
                <div>
                  {errors.title && <span>{errors.title.message}</span>}
                  {errors.content && <span>{errors.content.message}</span>}
                  {posts.value.errorMessage && <span>{posts.value.errorMessage}</span>}
                </div>
                <div className="flex items-center justify-between mt-8">
                  <button
                    disabled={!!posts.value.memento}
                    className={classNames("mx-auto border-[1px] border-[#ccc] border-solid opacity-100 hover:opacity-70 cursor-pointer text-[#333] font-bold py-2 px-4 rounded-sm",{
                      "bg-gray-200": Boolean(posts.value.memento)
                    })}
                    type="submit"
                  >
                    {(posts.value.memento) ? "loading..." : "thêm bài"}
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
