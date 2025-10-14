import { useState, type FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { isTelegramApp } from "@/lib/telegram";
import Container from "@/components/Container";
import SearchHeader from "@/components/SearchHeader";

const Events: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const isTelegram = isTelegramApp();

  const [searchValue, setSearchValue] = useState("");

  return (
    <Container paddingTop={isTelegram ? 92 : 44}>
      <SearchHeader searchValue={searchValue} onSearchChange={setSearchValue} />
    </Container>
  );
};

export default Events;
