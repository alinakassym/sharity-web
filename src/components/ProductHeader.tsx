import type { FC } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { Colors } from "../theme/colors";
import VuesaxIcon from "./VuesaxIcon";

interface ProductHeaderProps {
  onGoBack?: () => void;
}

const ProductHeader: FC<ProductHeaderProps> = ({ onGoBack }) => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <div
      style={{
        paddingRight: 56,
        paddingBottom: 8,
        height: 48,
        display: "flex",
        flex: 1,
        alignItems: "center",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceColor,
      }}
    >
      {/* кнопка назад */}
      <div
        style={{
          paddingTop: 2,
          width: 54,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={onGoBack}
      >
        <VuesaxIcon name="arrow-left" size={24} color={colors.primary} />
      </div>
      <div
        style={{
          position: "relative",
          height: 56,
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
      >
        ВЕРНУТЬСЯ НАЗАД
      </div>
    </div>
  );
};

export default ProductHeader;
