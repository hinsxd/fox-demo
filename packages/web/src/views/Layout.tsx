import React from 'react';
import TopBar from 'components/TopBar';
import BottomBar from 'components/BottomBar';

type Props = {
  view: 'home' | 'lessons' | 'cart';
};

const Layout: React.FC<Props> = ({ view, children }) => {
  return (
    <>
      <TopBar view={view} />
      {children}
      <BottomBar view={view} />
    </>
  );
};

export default Layout;
