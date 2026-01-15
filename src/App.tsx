// src/App.tsx

import type { FC } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useBodyBackground } from "./hooks/useBodyBackground";
import { ThemeProvider } from "./providers/ThemeProvider";
import StoreTabBar from "./components/StoreTabBar";
import MainTabBar from "./components/MainTabBar";
import TelegramUserInit from "./components/TelegramUserInit";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import Store from "./pages/Store";
import Product from "./pages/Product";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Orders from "./pages/Orders";
import Create from "./pages/Create";
import CreateCourse from "./pages/CreateCourse";
import CreateEvent from "./pages/CreateEvent";
import Course from "./pages/Course";
import Add from "./pages/Add";
import Profile from "./pages/Profile";
import MyPublications from "./pages/MyPublications";
import Users from "./pages/Users";
import Dictionaries from "./pages/Dictionaries";
import AuthRequired from "./pages/AuthRequired";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Checkout from "./pages/Checkout";
import PaymentMethods from "./pages/PaymentMethods";
import AddCard from "./pages/AddCard";
import { isTelegramApp } from "./lib/telegram";

import { useTelegramSafeArea } from "@/hooks/useTelegramSafeArea";

const AppContent: FC = () => {
  const isTelegram = isTelegramApp();
  const { pathname } = useLocation();
  const path = pathname.replace(import.meta.env.BASE_URL, "/");
  const showMainTabBar = ["/", "/add", "/profile"].includes(path);
  const showStoreTabBar = ["/store", "/favorites", "/cart", "/orders"].includes(
    path,
  );
  const safeArea = useTelegramSafeArea();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: `calc(100vh - ${safeArea.top})`,
      }}
    >
      {/* Инициализация пользователя Telegram при старте */}
      {isTelegram && <TelegramUserInit />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="classes" element={<Courses />} />
        <Route path="events" element={<Events />} />
        <Route path="store" element={<Store />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="all-orders" element={<Orders />} />
        <Route path="add" element={<Add />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-publications" element={<MyPublications />} />
        <Route path="users" element={<Users />} />
        <Route path="dictionaries" element={<Dictionaries />} />
        <Route path="create" element={<Create />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="course/:id" element={<Course />} />
        <Route path="auth-required" element={<AuthRequired />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failure" element={<PaymentFailure />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="add-card" element={<AddCard />} />
      </Routes>
      {showMainTabBar && <MainTabBar />}
      {showStoreTabBar && <StoreTabBar />}
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

export default App;
