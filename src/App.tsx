import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAnalytics } from './hooks/useAnalytics';
import React, { lazy, Suspense, useEffect } from 'react';

// Placeholder imports for pages
import Home from './pages/Home';
import Apartment from './pages/Apartment';
import Gallery from './pages/Gallery';
import Availability from './pages/Availability';
import Reservation from './pages/Reservation';
import Sete from './pages/Sete';
import Guide from './pages/Guide';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';

import Game from './pages/Game';

const Admin = lazy(() => import('./pages/Admin'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function AppRoutes() {
  useAnalytics();
  
  return (
    <Routes>
      <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="appartement" element={<Apartment />} />
        <Route path="galerie" element={<Gallery />} />
        <Route path="disponibilites" element={<Availability />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="sete" element={<Sete />} />
        <Route path="guide" element={<Guide />} />
        <Route path="partenaires" element={<Partners />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="mentions-legales" element={<Legal type="mentions" />} />
        <Route path="confidentialite" element={<Legal type="privacy" />} />
        <Route path="conditions-de-reservation" element={<Legal type="conditions" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}
