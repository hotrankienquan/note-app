import { Link } from "react-router-dom";
import { cookiesBrowser } from "./cookie/cookie-browser";
import { COOKIE_USER } from "./constants/common";
import { useEffect } from "react";
import { handleLogout } from "./func/logout";
import AddPost from "./AddPost";
import ListPost from "./ListPost";

const HomePage = () => {
  useEffect(() => {
    if (!cookiesBrowser.get(COOKIE_USER)) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div>
      <div className="w-full bg-green shadow z-1 flex items-center justify-between">
        <div className="container mx-auto">
          <div className="w-full flex justify-between items-center py-4 px-8">
            <div className="text-center text-[#333] font-bold">
              Your Company
            </div>
          </div>
        </div>
        <div className="mr-5">
          {!cookiesBrowser.get(COOKIE_USER) && (
            <>
              <Link
                to="/login"
                className="text-green-300 mr-2 text-[24px] font-bold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-purple-400 text-[24px] font-bold underline"
              >
                Register
              </Link>
            </>
          )}
          {cookiesBrowser.get(COOKIE_USER) && (
            <button
              onClick={handleLogout}
              className="text-purple-400 text-[24px] font-bold underline"
            >
              log out
            </button>
          )}
        </div>
      </div>
      <div className="p-5">
        <div>Viết bài mới:</div>
        <AddPost />
        <h4>Các bài ghi chú ở đây</h4>
        <ListPost />
      </div>
    </div>
  );
};

export default HomePage;
