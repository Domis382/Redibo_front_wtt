import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Home = dynamic(() => import('./Home'), { ssr: false });

export default function HomePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Home />
    </Suspense>
  );
}
