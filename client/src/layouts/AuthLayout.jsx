import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (<div className="AuthLayout">
    <Outlet />
  </div>
  );
}

export default AuthLayout;
