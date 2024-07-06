import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddPost, IQueryAddPost } from "./interface/common";
import { addPostSchema } from "./schema/schema-validate-form";
import { useEffect, useRef, useState } from "react";
import { QueryAddPost } from "./utils/class";
import { http } from "./http/make-request";
import { IApiResponse, IResAddPost } from "./interface/request.type";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";
import axios, { AxiosError } from "axios";
import { Editor } from "./Jodit-Editor";
import classNames from "classnames";
import { useStorePost } from "./AddPost";

interface IProps {
    content: string;
    title: string;
    closeModal: () => void;
}

type TimerId = ReturnType<typeof setTimeout>;

export function EditPost(props: IProps) {
    const timerId = useRef<TimerId>();
    const {addPost} = useStorePost()
    const [query, setQuery] = useState<IQueryAddPost>(new QueryAddPost())
    const [contentJodit, setContentJodit] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<IAddPost>({
        resolver: yupResolver(addPostSchema),
    });
    const onSubmit: SubmitHandler<IAddPost> = async (data) => {
        const submitData = {
            ...data,
            content: contentJodit
        }
        setQuery(prev => ({ ...prev, memento: new QueryAddPost() }))
        try {
            const result = await http.post<IAddPost, IApiResponse<IResAddPost>>("/edit-note", {
                ...submitData,
            }, {
                headers: {
                    "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
                    "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
                },
            });
            if (result.status !== 200) {
                throw new Error("fetch failed")
            }

            setQuery(prev => ({ ...prev, memento: undefined }))
            reset({
                title: "",
            })
            addPost(result.metadata)
            timerId.current = setTimeout(() => {
                props.closeModal()
            }, 2000)
        } catch (error) { /* empty */
            const errors = error as AxiosError<{
                code: number;
                message: string;
                stack: string;
                status: string;
            }>;
            if (!axios.isAxiosError(error)) {
                // do whatever you want with native error
                console.log('native error', errors);

            }
            if (errors.message === 'fetch failed') {
                setQuery(prev => ({ ...prev, memento: prev.memento, errorMessage: "co loi xay ra" }))
            }

        }
    };
    function getContent(values: string) {
        setContentJodit(values)
    }
    useEffect(() => {
        setValue("title", props.title)
    }, [props.title, setValue])
    useEffect(() => {
        return () => {
            clearTimeout(timerId.current)
        }
    }, [])
    return (<>
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
                    <Editor getContent={getContent} contentInit={props.content} />
                </div>
                <div>
                    {errors.title && <p>{errors.title.message}</p>}
                    {query.errorMessage && <p>{query.errorMessage}</p>}
                </div>
                <div className="flex items-center justify-between mt-8">
                    <button
                        disabled={!!query.memento}
                        className={classNames("mx-auto border-[1px] border-[#ccc] border-solid opacity-100 hover:opacity-70 cursor-pointer text-[#333] font-bold py-2 px-4 rounded-sm", {
                            "bg-gray-200": Boolean(query.memento)
                        })}
                        type="submit"
                    >
                        {(query.memento) ? "loading..." : "cập nhật bài"}
                    </button>
                </div>
            </div>
        </form>
    </>)
}