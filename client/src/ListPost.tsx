import { useStorePost } from "./AddPost";
import { useGetListPost } from "./hooks/useGetListPost";
import { SinglePost } from "./SinglePost";

interface IDataPassToSinglePost {
  id: number;
  title: string;
  content: string;
}
function ListPost() {
  const { dataPost } = useStorePost();
  const { dataSource, query, setQuery } = useGetListPost()
  function handlePrev() {
    if (query.offset <= 0) {
      return;
    }
    setQuery(prev => ({ ...prev, offset: prev.offset - 1 }))
  }
  function handleNext() {
    if (dataSource?.data?.length === 0) {
      return;
    }
    setQuery(prev => ({ ...prev, offset: prev.offset + 1 }))
  }
  return (
    <>
      {dataPost && Array.isArray(dataPost) && dataPost.map((data: IDataPassToSinglePost) =>
       <SinglePost
       key={data.id}
        {...data}
      />)
      }
      {query.memento ? (
        <p>Loading...</p>
      ) : (
        Array.isArray(dataSource?.data) && dataSource?.data.map((data: IDataPassToSinglePost) => 
        <SinglePost
          key={data.id}
          {...data}
        />)
      )}
      <div className="">
        {query.offset > 0 && <button className="float-left" onClick={handlePrev}>bài trước</button>}
        <button className="float-right" onClick={handleNext}>bài sau</button>
      </div>
    </>
  );
}

export default ListPost;
