import type { FC } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useBodyBackground } from "./hooks/useBodyBackground";
import { ThemeProvider } from "./providers/ThemeProvider";
import TabBar from "./components/TabBar";
import Home from "./pages/sharity-web/Home";
import Classes from "./pages/sharity-web/Classes";
import Events from "./pages/sharity-web/Events";
import Store from "./pages/sharity-web/Store";
import Product from "./pages/sharity-web/Product";
import Favorites from "./pages/sharity-web/Favorites";
import Cart from "./pages/sharity-web/Cart";
import Orders from "./pages/sharity-web/Orders";
import Create from "./pages/sharity-web/Create";
import CreateCourse from "./pages/sharity-web/CreateCourse";
import Course from "./pages/sharity-web/Course";

const AppContent: FC = () => {
  const { pathname } = useLocation();
  const path = pathname.replace(import.meta.env.BASE_URL, "/");
  const showTabBar = ["/store", "/favorites", "/cart", "/orders"].includes(
    path,
  );

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="classes" element={<Classes />} />
        <Route path="events" element={<Events />} />
        <Route path="store" element={<Store />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="create" element={<Create />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="course/:id" element={<Course />} />
      </Routes>
      {showTabBar && <TabBar />}
    </div>
  );
};

const App: FC = () => {
  useBodyBackground();

  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App
