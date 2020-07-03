import React, { lazy, Suspense } from 'react';
const Home = lazy(() => import('./Home'));
const HomeLoader: React.FC = () => {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Home />
    </Suspense>
  );
};
export default HomeLoader;
