import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./authContext";

export default function PublicRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated || (localStorage.getItem("role") !== "capitán" && localStorage.getItem("role") !== "supervisor")) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
