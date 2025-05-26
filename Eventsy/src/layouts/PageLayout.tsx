import { Outlet } from 'react-router-dom';
import type { FC } from 'react';

const PageLayout: FC = () => {
  return (
    <div className="w-full bg-mainbg-90 text-white rounded-2xl pb-10">
      <Outlet />
    </div>
  );
};

export default PageLayout;
