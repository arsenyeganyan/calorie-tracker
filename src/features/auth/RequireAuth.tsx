import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery } from "./authApiSlice";

const RequireAuth = () => {
  const {
    isLoading,
    isSuccess,
    isError,
  } = useCheckAuthQuery();

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if(isSuccess) {
    content = <Outlet />;
  } else if(isError) {
    content =<Navigate to="/login" replace />;
  }

  return content;
}

export default RequireAuth;