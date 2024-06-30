import { COOKIE_USER } from "../constants/common";
import { cookiesBrowser } from "../cookie/cookie-browser";
import { http } from "../http/make-request";

async function handleLogout() {
  try {
    const result = await http.post(
      "/logout",
      {},
      {
        headers: {
          "x-client-id": cookiesBrowser.get(COOKIE_USER)?.user?.id,
          "x-atoken-id": cookiesBrowser.get(COOKIE_USER)?.tokens?.accesstoken,
        },
      }
    );
    if (result.status === 200) {
      cookiesBrowser.remove(COOKIE_USER);
      window.location.href = "/login";
    }
  } catch (error) {
    /** */
  }
}
export { handleLogout };
