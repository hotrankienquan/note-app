import { IApiResponse } from "./interface/request.type";
import { IListPost, INoteUser } from "./interface/common";
import { http } from "./http/make-request";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";
import { useEffect, useState } from "react";
const LIMIT = 10;
function ListPost() {
  const [currentPost, setCurrentPost] = useState<IListPost>({
    data: null,
    errorMessage: "",
    memento: undefined,
    offset: 0,
  });
  
  useEffect(() => {
    async function getData() {
      try {
        setCurrentPost((prev) => ({
          ...prev,
          memento: {
            data: null,
            errorMessage: "",
            memento: undefined,
            offset: 0
          },
        }));
        const response = await http.get<
          Record<string, never>,
          IApiResponse<INoteUser>
        >("/get-note-of-user", {
          headers: {
            "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
            "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
          },
          params: {
            limit: LIMIT,
            offset: currentPost.offset,
          },
        });
        if (response.status !== 200) {
          setCurrentPost((prev) => ({
            ...prev,
            errorMessage: response.message,
            memento: undefined,
          }));
        }
        setCurrentPost((prev) => ({
          ...prev,
          data: response.metadata,
          errorMessage: response.message,
          memento: undefined,
        }));
      } catch (error) {
        setCurrentPost((prev) => ({ ...prev, memento: undefined }));
      }
    }
    getData();
  }, [currentPost.offset]);
  function handleNext() {
    if(currentPost.data?.data?.length === 0){
      return;
    }
    setCurrentPost((prev) => ({
      ...prev,
      offset:currentPost.offset + 1,
    }));
  }
  function handleBack() {
    if(currentPost.offset === 0){
      return;
    }
    setCurrentPost((prev) => ({
      ...prev,
      offset:currentPost.offset - 1,
    }));
  }
  return (
    <>
      {currentPost.memento ? (
        <p>Loading...</p>
      ) : (
        currentPost?.data &&
        currentPost?.data?.data &&
        currentPost?.data?.data.map((item) => {
          return (
            <div key={item.id} className="p-2 m-2 border-b-2 border-solid min-h-[200px]">
              <p>Title: {item.title}</p>
              <p>Content: {item.content}</p>
            </div>
          );
        })
      )}
      <div className="flex items-center justify-between">
        {currentPost.offset === 0 && currentPost.data && currentPost.data?.countRecord <= LIMIT ? (
          <></>
        ) : (
          <button onClick={handleBack}>Previous post</button>
        )}
        

          <button onClick={handleNext}>Next post</button>
         
        
      </div>
    </>
  );
}

export default ListPost;
