import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import KeplerLayout from './components/Kepler/KeplerLayout';
import KeplerIndex from './pages/Kepler/index';
import KeplerMovimiento from './pages/Kepler/Movimiento';
import KeplerHohmann from './pages/Kepler/Hohmann';
import KeplerInfluencia from './pages/Kepler/Influencia';
import KeplerEnergia from './pages/Kepler/Energia';
import KeplerSimulador from './pages/Kepler/Simulador';
import KeplerReferencias from './pages/Kepler/Referencias';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="kepler" element={<KeplerLayout />}>
          <Route index element={<KeplerIndex />} />
          <Route path="movimiento" element={<KeplerMovimiento />} />
          <Route path="hohmann" element={<KeplerHohmann />} />
          <Route path="influencia" element={<KeplerInfluencia />} />
          <Route path="energia" element={<KeplerEnergia />} />
          <Route path="simulador" element={<KeplerSimulador />} />
          <Route path="referencias" element={<KeplerReferencias />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
