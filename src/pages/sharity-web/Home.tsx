import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import LocationHeader from "@/components/LocationHeader";
import Carousel from "@/components/Carousel";
import bannerImage from "@/assets/banner.png";

const Home: FC = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const carouselItems = [
    {
      id: "1",
      image: bannerImage,
      alt: "INTERTOP - Мечтай. Играй. Побеждай!",
    },
    {
      id: "2",
      image: "https://picsum.photos/400/200?random=1",
      alt: "Banner 2",
    },
    {
      id: "3",
      image: "https://picsum.photos/400/200?random=2",
      alt: "Banner 3",
    },
  ];

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background,
      }}
    >
      <LocationHeader />

      {/* Main Content */}
      <div
        style={{
          paddingTop: "48px",
          paddingBottom: "80px",
        }}
      >
        {/* Carousel Banner */}
        <Carousel items={carouselItems} autoPlayInterval={3000} />

        <h1 style={{ color: colors.text, marginTop: 24 }}>Home</h1>
        <p style={{ color: colors.text }}>Sharity App WebViews</p>
        <p style={{ color: colors.text }}>DB: Firebase</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad nemo minus
          deserunt, accusantium eum doloremque accusamus ullam culpa tempora,
          debitis quasi ipsa mollitia non itaque fugit, impedit ut labore ea.
          Tempore asperiores vero, quia error saepe blanditiis laboriosam
          pariatur! Modi illum, inventore quo et expedita non ipsa iusto
          doloremque ex placeat esse quos accusantium facilis ullam qui
          obcaecati autem nesciunt. Voluptatum dolores animi, mollitia, nemo
          odio aliquam consectetur quidem nostrum temporibus repellat dicta.
          Fugit quaerat voluptatem nostrum in et dolorum eveniet deserunt
          voluptate architecto laborum! Amet accusamus voluptas eos incidunt.
          Exercitationem, non illo et voluptates quasi quo optio earum doloribus
          eum quas quaerat laboriosam fugit minus omnis pariatur voluptatibus
          labore praesentium similique qui aspernatur alias saepe autem fuga!
          Consequatur, temporibus. Ut beatae excepturi aliquam recusandae
          reiciendis commodi repudiandae, quod dolor expedita nulla soluta
          ipsam. Quasi libero nesciunt magni earum eius. Ratione aliquid
          consequatur neque maiores sunt id dicta asperiores aspernatur.
          Molestias deserunt iure, consequuntur porro unde ullam sapiente
          laborum reiciendis voluptates, repellendus dolore minima alias
          quisquam temporibus quos, voluptas recusandae veniam quidem adipisci
          omnis dicta blanditiis impedit esse. Vitae, quaerat! Distinctio
          sapiente enim unde at fugit! Earum consequatur, repellendus nulla nemo
          quam ipsam minima hic soluta illo neque sed vero inventore odio
          reiciendis ex quis doloremque accusantium illum. Ipsa, minima. Earum
          cumque sapiente et facere odit vitae deserunt, ex voluptatibus
          doloribus repudiandae. Fugit eum magnam officiis, nihil laudantium,
          minus velit vero reprehenderit rem repudiandae eos atque aut nobis
          similique iure? Porro consectetur culpa vero sint dicta accusantium
          at, reprehenderit nisi eius voluptatibus, suscipit tempora.
          Reprehenderit minus quidem quas architecto harum alias suscipit
          consectetur. Enim laboriosam omnis minus architecto sit blanditiis.
          Debitis quam autem ex inventore voluptatibus reiciendis dignissimos,
          voluptatem, vel, eos eligendi veniam blanditiis quas optio sapiente?
          Temporibus incidunt iste cum voluptatum id, eveniet vitae accusamus
          suscipit quaerat quod obcaecati. Optio debitis quod nesciunt enim
          assumenda modi repellendus nulla eos voluptas ducimus! Incidunt iste
          earum ab ipsum itaque quasi saepe, non aut pariatur, iusto eveniet
          molestiae, possimus esse corporis at? Expedita eius doloremque enim
          quod cumque iste ullam, non qui, a aspernatur sunt sed similique
          reiciendis eos ex error dolores, autem maxime! Saepe impedit nam magni
          ipsa, voluptate ab quas.
        </p>
      </div>
    </section>
  );
};

export default Home;
