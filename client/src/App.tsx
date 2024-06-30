import { Navigate, Route, Routes } from "react-router";
import Login from "./Login";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
function PrivateRoute(props: { children: JSX.Element }) {
  const auth = true;
  return auth ? <>{props.children}</> : <Navigate to="/login" />;
}
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>profile page</>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
