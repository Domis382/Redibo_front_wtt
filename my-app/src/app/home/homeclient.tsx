'use client';

import { Suspense } from 'react';
import Home from './Home';

export default function HomeClient() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Home />
    </Suspense>
  );
}
