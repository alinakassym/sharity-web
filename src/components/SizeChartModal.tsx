// src/components/SizeChartModal.tsx

import type { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import type { SizeData } from "@/hooks/useSizes";

interface SizeChartModalProps {
  open: boolean;
  onClose: () => void;
  sizes: SizeData[];
}

const SizeChartModal: FC<SizeChartModalProps> = ({ open, onClose, sizes }) => {
  const scheme = useColorScheme();
  const c = Colors[scheme];

  // Определяем, какие колонки заполнены хотя бы у одного размера
  const hasRussianSize = sizes.some((s) => s.size_ua_ru);
  const hasHeight = sizes.some(
    (s) => s.height_from != null || s.height_to != null,
  );
  const hasFootSize = sizes.some((s) => s.foot_size);
  const hasCircumference = sizes.some((s) => s.circumference);
  const hasLength = sizes.some((s) => s.length != null);
  const hasDiameter = sizes.some((s) => s.diameter != null);

  const formatHeight = (from?: number, to?: number): string => {
    if (from != null && to != null) return `${from}-${to}`;
    if (from != null) return `${from}`;
    if (to != null) return `${to}`;
    return "";
  };

  const headCellSx = {
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "16px",
    color: c.lightText,
    backgroundColor: scheme === "dark" ? c.opacity : "#F5F5F5",
    borderBottom: `1px solid ${c.border}`,
    whiteSpace: "nowrap" as const,
  };

  const bodyCellSx = {
    fontSize: 15,
    color: c.text,
    borderBottom: `1px solid ${c.border}`,
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Таблица размеров
        </Typography>

        <IconButton aria-label="close" onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 0, pt: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>
                <span>
                  Размер<br></br>производителя
                </span>
              </TableCell>
              {hasRussianSize && (
                <TableCell sx={headCellSx}>Размер UA/RU</TableCell>
              )}
              {hasHeight && <TableCell sx={headCellSx}>Рост, см</TableCell>}
              {hasFootSize && (
                <TableCell sx={headCellSx}>Размер стопы</TableCell>
              )}
              {hasCircumference && (
                <TableCell sx={headCellSx}>Обхват</TableCell>
              )}
              {hasLength && <TableCell sx={headCellSx}>Длина</TableCell>}
              {hasDiameter && <TableCell sx={headCellSx}>Диаметр</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {sizes.map((size) => (
              <TableRow key={size.id}>
                <TableCell sx={bodyCellSx}>{size.manufacturer_size}</TableCell>
                {hasRussianSize && (
                  <TableCell sx={bodyCellSx}>{size.size_ua_ru ?? ""}</TableCell>
                )}
                {hasHeight && (
                  <TableCell sx={bodyCellSx}>
                    {formatHeight(size.height_from, size.height_to)}
                  </TableCell>
                )}
                {hasFootSize && (
                  <TableCell sx={bodyCellSx}>{size.foot_size ?? ""}</TableCell>
                )}
                {hasCircumference && (
                  <TableCell sx={bodyCellSx}>
                    {size.circumference ?? ""}
                  </TableCell>
                )}
                {hasLength && (
                  <TableCell sx={bodyCellSx}>
                    {size.length != null ? size.length : ""}
                  </TableCell>
                )}
                {hasDiameter && (
                  <TableCell sx={bodyCellSx}>
                    {size.diameter != null ? size.diameter : ""}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartModal;
