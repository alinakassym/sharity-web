import type { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useBodyBackground } from './hooks/useBodyBackground'
import Home from './pages/sharity-web/Home'
import Classes from './pages/sharity-web/Classes'
import Events from './pages/sharity-web/Events'
import Store from './pages/sharity-web/Store'
import Product from './pages/sharity-web/Product'
import Favorites from './pages/sharity-web/Favorites'
import Cart from './pages/sharity-web/Cart'
import Orders from './pages/sharity-web/Orders'

const App: FC = () => {
  useBodyBackground();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sharity-web/" element={<Home />} />
        <Route path="/sharity-web/classes" element={<Classes />} />
        <Route path="/sharity-web/events" element={<Events />} />
        <Route path="/sharity-web/store" element={<Store />} />
        <Route path="/sharity-web/product/:id" element={<Product />} />
        <Route path="/sharity-web/favorites" element={<Favorites />} />
        <Route path="/sharity-web/cart" element={<Cart />} />
        <Route path="/sharity-web/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
