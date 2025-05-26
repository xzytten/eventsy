import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="w-full bg-background">
      <div className="auth-layout w-full flex justify-center items-center max-h-screen">
        <Outlet />
      </div>
    </div>
  );
};
