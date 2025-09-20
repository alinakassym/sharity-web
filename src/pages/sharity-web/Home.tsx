import type { FC } from 'react'
import TabBar from "@/components/TabBar";

const Home: FC = () => {
  return (
    <section style={{ padding: 16 }}>
      <h1>Home</h1>
      <p>Sharity App WebViews</p>
      <TabBar />
    </section>
  );
}

export default Home
