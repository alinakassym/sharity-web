import type { FC } from 'react'
import TabBar from "@/components/TabBar";

const Home: FC = () => {
  return (
    <section style={{ padding: 16 }}>
      <h1>Home</h1>
      <p>Лёгкие страницы под WebView из мобильного приложения.</p>
      <TabBar />
    </section>
  );
}

export default Home
