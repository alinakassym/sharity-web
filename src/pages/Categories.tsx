// sharity-web/src/pages/Categories.tsx

import { useState } from "react";
import type { FC } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import {
  useSafePaddingTop,
  useSafePlatform,
} from "@/hooks/useTelegramSafeArea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  useCategories,
  type CategoryData,
  type CreateCategoryData,
} from "@/hooks/useCategories";
import {
  useSubcategories,
  type SubcategoryData,
  type CreateSubcategoryData,
} from "@/hooks/useSubcategories";
import {
  useSizes,
  type SizeData,
  type CreateSizeData,
} from "@/hooks/useSizes";
import LoadingScreen from "@/components/LoadingScreen";
import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import VuesaxIcon from "@/components/icons/VuesaxIcon";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Typography,
  CircularProgress,
  Collapse,
  Chip,
  MenuItem,
} from "@mui/material";

const emptyForm: CreateCategoryData = {
  name_ru: "",
  name_en: "",
  icon: "",
  is_active: true,
  order: undefined,
};

const emptySubForm: CreateSubcategoryData = {
  name_ru: "",
  name_en: "",
  is_active: true,
  saleType: "all",
  order: undefined,
};

const saleTypeLabels: Record<string, string> = {
  all: "Индивидуально и группы",
  group: "Группа",
  individual: "Индивид.",
};

const emptySizeForm: CreateSizeData = {
  manufacturer_size: "",
  size_ua_ru: undefined,
  size_eu: undefined,
  height_from: undefined,
  height_to: undefined,
  length: undefined,
  diameter: undefined,
  foot_size: undefined,
  circumference: undefined,
  is_active: true,
  order: undefined,
};

const Categories: FC = () => {
  const scheme = useColorScheme();
  const c = Colors[scheme];
  const paddingTop = useSafePaddingTop(48, 0);
  const platformName = useSafePlatform();
  const { userData, isLoading: isUserLoading } = useCurrentUser();
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    toggleActive,
    deleteCategory,
  } = useCategories();

  // --- Category dialog state ---
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const [formData, setFormData] = useState<CreateCategoryData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // --- Subcategory expand + CRUD state ---
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );
  const {
    subcategories,
    isLoading: isSubLoading,
    error: subError,
    createSubcategory,
    updateSubcategory,
    toggleActive: toggleSubActive,
    deleteSubcategory,
  } = useSubcategories(expandedCategoryId);

  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubcategoryData | null>(null);
  const [subFormData, setSubFormData] =
    useState<CreateSubcategoryData>(emptySubForm);
  const [isSubSaving, setIsSubSaving] = useState(false);
  const [deleteSubConfirmId, setDeleteSubConfirmId] = useState<string | null>(
    null,
  );

  // --- Sizes dialog state ---
  const [sizesDialogSub, setSizesDialogSub] = useState<SubcategoryData | null>(
    null,
  );
  const {
    sizes,
    isLoading: isSizesLoading,
    error: sizesError,
    createSize,
    updateSize,
    toggleActive: toggleSizeActive,
    deleteSize,
  } = useSizes(expandedCategoryId, sizesDialogSub?.id ?? null);

  const [sizeFormOpen, setSizeFormOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<SizeData | null>(null);
  const [sizeFormData, setSizeFormData] =
    useState<CreateSizeData>(emptySizeForm);
  const [isSizeSaving, setIsSizeSaving] = useState(false);
  const [deleteSizeConfirmId, setDeleteSizeConfirmId] = useState<string | null>(
    null,
  );

  if (isUserLoading) return <LoadingScreen />;

  const isAdmin = userData?.role === "admin";

  if (!isAdmin) {
    return (
      <Container
        paddingTop={
          platformName === "desktop"
            ? paddingTop + 92
            : platformName === "unknown"
              ? 88
              : paddingTop + 44
        }
      >
        <PageHeader title="Категории" backTo="/dictionaries" />
        <Box
          sx={{
            padding: 5,
            textAlign: "center",
            color: c.error,
          }}
        >
          У вас нет доступа к этой странице
        </Box>
      </Container>
    );
  }

  // --- Category handlers ---

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setFormData({
      name_ru: category.name_ru,
      name_en: category.name_en,
      icon: category.icon ?? "",
      is_active: category.is_active,
      order: category.order,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave: CreateCategoryData = {
        name_ru: formData.name_ru.trim(),
        name_en: formData.name_en.trim(),
        icon: formData.icon?.trim() || undefined,
        is_active: formData.is_active,
        order:
          formData.order !== undefined && formData.order !== null
            ? Number(formData.order)
            : undefined,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, dataToSave);
      } else {
        await createCategory(dataToSave);
      }
      handleClose();
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось сохранить"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось переключить"}`,
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCategory(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось удалить"}`,
      );
    }
  };

  // --- Subcategory handlers ---

  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleOpenSubCreate = () => {
    setEditingSub(null);
    setSubFormData(emptySubForm);
    setSubDialogOpen(true);
  };

  const handleOpenSubEdit = (sub: SubcategoryData) => {
    setEditingSub(sub);
    setSubFormData({
      name_ru: sub.name_ru,
      name_en: sub.name_en,
      is_active: sub.is_active,
      saleType: sub.saleType ?? "all",
      order: sub.order,
    });
    setSubDialogOpen(true);
  };

  const handleSubClose = () => {
    setSubDialogOpen(false);
    setEditingSub(null);
    setSubFormData(emptySubForm);
  };

  const handleSubSave = async () => {
    setIsSubSaving(true);
    try {
      const dataToSave: CreateSubcategoryData = {
        name_ru: subFormData.name_ru.trim(),
        name_en: subFormData.name_en.trim(),
        is_active: subFormData.is_active,
        saleType: subFormData.saleType ?? "all",
        order:
          subFormData.order !== undefined && subFormData.order !== null
            ? Number(subFormData.order)
            : undefined,
      };

      if (editingSub) {
        await updateSubcategory(editingSub.id, dataToSave);
      } else {
        await createSubcategory(dataToSave);
      }
      handleSubClose();
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось сохранить подкатегорию"}`,
      );
    } finally {
      setIsSubSaving(false);
    }
  };

  const handleSubToggle = async (id: string) => {
    try {
      await toggleSubActive(id);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось переключить"}`,
      );
    }
  };

  const handleSubDelete = async () => {
    if (!deleteSubConfirmId) return;
    try {
      await deleteSubcategory(deleteSubConfirmId);
      setDeleteSubConfirmId(null);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось удалить подкатегорию"}`,
      );
    }
  };

  // --- Size handlers ---

  const handleOpenSizesDialog = (sub: SubcategoryData) => {
    setSizesDialogSub(sub);
  };

  const handleCloseSizesDialog = () => {
    setSizesDialogSub(null);
    setSizeFormOpen(false);
    setEditingSize(null);
    setSizeFormData(emptySizeForm);
    setDeleteSizeConfirmId(null);
  };

  const handleOpenSizeCreate = () => {
    setEditingSize(null);
    setSizeFormData(emptySizeForm);
    setSizeFormOpen(true);
  };

  const handleOpenSizeEdit = (size: SizeData) => {
    setEditingSize(size);
    setSizeFormData({
      manufacturer_size: size.manufacturer_size,
      size_ua_ru: size.size_ua_ru,
      size_eu: size.size_eu,
      height_from: size.height_from,
      height_to: size.height_to,
      length: size.length,
      diameter: size.diameter,
      foot_size: size.foot_size,
      circumference: size.circumference,
      is_active: size.is_active,
      order: size.order,
    });
    setSizeFormOpen(true);
  };

  const handleSizeFormClose = () => {
    setSizeFormOpen(false);
    setEditingSize(null);
    setSizeFormData(emptySizeForm);
  };

  const handleSizeSave = async () => {
    setIsSizeSaving(true);
    try {
      const dataToSave: CreateSizeData = {
        manufacturer_size: sizeFormData.manufacturer_size.trim(),
        size_ua_ru: sizeFormData.size_ua_ru?.trim() || undefined,
        size_eu: sizeFormData.size_eu?.trim() || undefined,
        height_from:
          sizeFormData.height_from !== undefined &&
          sizeFormData.height_from !== null
            ? Number(sizeFormData.height_from)
            : undefined,
        height_to:
          sizeFormData.height_to !== undefined &&
          sizeFormData.height_to !== null
            ? Number(sizeFormData.height_to)
            : undefined,
        length:
          sizeFormData.length !== undefined && sizeFormData.length !== null
            ? Number(sizeFormData.length)
            : undefined,
        diameter:
          sizeFormData.diameter !== undefined && sizeFormData.diameter !== null
            ? Number(sizeFormData.diameter)
            : undefined,
        foot_size: sizeFormData.foot_size?.trim() || undefined,
        circumference: sizeFormData.circumference?.trim() || undefined,
        is_active: sizeFormData.is_active,
        order:
          sizeFormData.order !== undefined && sizeFormData.order !== null
            ? Number(sizeFormData.order)
            : undefined,
      };

      if (editingSize) {
        await updateSize(editingSize.id, dataToSave);
      } else {
        await createSize(dataToSave);
      }
      handleSizeFormClose();
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось сохранить размер"}`,
      );
    } finally {
      setIsSizeSaving(false);
    }
  };

  const handleSizeToggle = async (id: string) => {
    try {
      await toggleSizeActive(id);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось переключить"}`,
      );
    }
  };

  const handleSizeDelete = async () => {
    if (!deleteSizeConfirmId) return;
    try {
      await deleteSize(deleteSizeConfirmId);
      setDeleteSizeConfirmId(null);
    } catch (err) {
      alert(
        `Ошибка: ${err instanceof Error ? err.message : "Не удалось удалить размер"}`,
      );
    }
  };

  const sizeLabel = (size: SizeData): string => {
    const parts: string[] = [];
    // if (size.manufacturer_size) parts.push(size.manufacturer_size);
    if (size.size_ua_ru) parts.push(`Размер UA/RU: ${size.size_ua_ru}`);
    if (size.size_eu) parts.push(`EU: ${size.size_eu}`);
    if (size.height_from != null || size.height_to != null)
      parts.push(
        `Рост: ${size.height_from ?? "?"}–${size.height_to ?? "?"} см`,
      );
    if (size.length != null) parts.push(`Длина: ${size.length} см`);
    if (size.diameter != null) parts.push(`Диаметр: ${size.diameter} см`);
    if (size.foot_size) parts.push(`Нога: ${size.foot_size}`);
    if (size.circumference) parts.push(`Окружность: ${size.circumference} мм`);
    return parts.join("\n") || "Пустой размер";
  };

  const isFormValid = formData.name_ru.trim() && formData.name_en.trim();
  const isSubFormValid =
    subFormData.name_ru.trim() && subFormData.name_en.trim();
  const deletingCategory = categories.find((ct) => ct.id === deleteConfirmId);
  const deletingSub = subcategories.find((s) => s.id === deleteSubConfirmId);
  const deletingSize = sizes.find((s) => s.id === deleteSizeConfirmId);

  return (
    <Container
      paddingTop={
        platformName === "desktop"
          ? 64
          : platformName === "unknown"
            ? 64
            : paddingTop + 64
      }
    >
      <PageHeader title="Категории" backTo="/dictionaries" />

      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Описание */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: c.surfaceColor,
            borderRadius: "12px",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              color: c.lightText,
              lineHeight: 1.5,
            }}
          >
            Управление категориями. Добавляйте, редактируйте и переключайте
            активность категорий. Нажмите на категорию, чтобы увидеть
            подкатегории.
          </Typography>
        </Box>

        {/* Кнопка добавления */}
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 600 }}
        >
          Добавить категорию
        </Button>

        {/* Список */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              padding: 2,
              backgroundColor: c.surfaceColor,
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: c.error, fontSize: 14 }}>
              {error}
            </Typography>
          </Box>
        ) : categories.length === 0 ? (
          <Box
            sx={{
              padding: 4,
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: c.lightText, fontSize: 14 }}>
              Категории не найдены
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {categories.map((cat) => {
              const isExpanded = expandedCategoryId === cat.id;

              return (
                <Box key={cat.id}>
                  {/* Category card */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      backgroundColor: c.surfaceColor,
                      borderRadius: isExpanded ? "12px 12px 0 0" : "12px",
                      opacity: cat.is_active ? 1 : 0.5,
                      transition: "border-radius 0.2s",
                    }}
                  >
                    {/* Left: expand arrow + icon + names */}
                    <Box
                      onClick={() => handleToggleExpand(cat.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flex: 1,
                        minWidth: 0,
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          transition: "transform 0.2s",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <VuesaxIcon
                          name="arrow-down"
                          size={18}
                          stroke={c.lightText}
                        />
                      </Box>
                      {cat.icon && (
                        <VuesaxIcon name={cat.icon} size={24} color={c.text} />
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: c.text,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cat.name_ru}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: c.lightText,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cat.name_en}
                          {cat.order !== undefined && ` · #${cat.order}`}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right: switch + edit + delete */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Switch
                        size="small"
                        checked={cat.is_active}
                        onChange={() => handleToggle(cat.id)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <VuesaxIcon
                          name="edit-2"
                          size={18}
                          stroke={c.primary}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirmId(cat.id)}
                      >
                        <VuesaxIcon name="trash" size={18} stroke={c.error} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Subcategories expandable section */}
                  <Collapse in={isExpanded}>
                    <Box
                      sx={{
                        backgroundColor: c.surfaceColor,
                        borderTop: `1px solid ${c.border}`,
                        borderRadius: "0 0 12px 12px",
                        px: 2,
                        pb: 1.5,
                        pt: 1,
                      }}
                    >
                      {isSubLoading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 2,
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      ) : subError ? (
                        <Typography
                          sx={{ color: c.error, fontSize: 13, py: 1 }}
                        >
                          {subError}
                        </Typography>
                      ) : subcategories.length === 0 ? (
                        <Typography
                          sx={{
                            color: c.lightText,
                            fontSize: 13,
                            py: 1,
                            textAlign: "center",
                          }}
                        >
                          Подкатегории не найдены
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {subcategories.map((sub) => (
                            <Box
                              key={sub.id}
                              sx={{
                                padding: "8px 12px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                backgroundColor: c.background,
                                borderRadius: "8px",
                                opacity: sub.is_active ? 1 : 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                      color: c.text,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {sub.name_ru}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 11,
                                      color: c.lightText,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {sub.name_en}
                                    {sub.order !== undefined &&
                                      ` · #${sub.order}`}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Switch
                                    size="small"
                                    checked={sub.is_active}
                                    onChange={() => handleSubToggle(sub.id)}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenSubEdit(sub)}
                                  >
                                    <VuesaxIcon
                                      name="edit-2"
                                      size={16}
                                      stroke={c.primary}
                                    />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      setDeleteSubConfirmId(sub.id)
                                    }
                                  >
                                    <VuesaxIcon
                                      name="trash"
                                      size={16}
                                      stroke={c.error}
                                    />
                                  </IconButton>
                                </Box>
                              </Box>

                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={
                                    saleTypeLabels[sub.saleType ?? "all"] ??
                                    "Индивидуально и группы"
                                  }
                                  size="small"
                                  sx={{
                                    fontSize: 11,
                                    height: 24,
                                    backgroundColor:
                                      sub.saleType === "group"
                                        ? c.accent
                                        : sub.saleType === "individual"
                                          ? c.primary
                                          : undefined,
                                    color:
                                      sub.saleType && sub.saleType !== "all"
                                        ? c.lighter
                                        : undefined,
                                  }}
                                />
                                <Chip
                                  label="Размеры"
                                  size="small"
                                  onClick={() => handleOpenSizesDialog(sub)}
                                  sx={{
                                    fontSize: 11,
                                    height: 24,
                                    cursor: "pointer",
                                  }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Add subcategory button */}
                      <Button
                        size="small"
                        onClick={handleOpenSubCreate}
                        sx={{
                          mt: 1,
                          textTransform: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          width: "100%",
                        }}
                      >
                        + Добавить подкатегорию
                      </Button>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Диалог создания/редактирования категории */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>
          {editingCategory ? "Редактировать категорию" : "Новая категория"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "8px !important",
          }}
        >
          <TextField
            label="Название (RU)"
            value={formData.name_ru}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_ru: e.target.value }))
            }
            required
            fullWidth
          />
          <TextField
            label="Name (EN)"
            value={formData.name_en}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_en: e.target.value }))
            }
            required
            fullWidth
          />
          <TextField
            label="Иконка (имя VuesaxIcon)"
            value={formData.icon ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, icon: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Порядок сортировки"
            type="number"
            value={formData.order ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
            }
            label="Активна"
            sx={{ color: c.text }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            sx={{ textTransform: "none" }}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления категории */}
      <Dialog
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>Удалить категорию?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: c.lightText }}>
            Категория «{deletingCategory?.name_ru}» будет удалена. Это действие
            нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirmId(null)}
            sx={{ textTransform: "none" }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ textTransform: "none" }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог создания/редактирования подкатегории */}
      <Dialog
        open={subDialogOpen}
        onClose={handleSubClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>
          {editingSub ? "Редактировать подкатегорию" : "Новая подкатегория"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "8px !important",
          }}
        >
          <TextField
            label="Название (RU)"
            value={subFormData.name_ru}
            onChange={(e) =>
              setSubFormData((prev) => ({ ...prev, name_ru: e.target.value }))
            }
            required
            fullWidth
          />
          <TextField
            label="Name (EN)"
            value={subFormData.name_en}
            onChange={(e) =>
              setSubFormData((prev) => ({ ...prev, name_en: e.target.value }))
            }
            required
            fullWidth
          />
          <TextField
            label="Порядок сортировки"
            type="number"
            value={subFormData.order ?? ""}
            onChange={(e) =>
              setSubFormData((prev) => ({
                ...prev,
                order:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            fullWidth
          />
          <TextField
            select
            label="Тип продажи"
            value={subFormData.saleType ?? "all"}
            onChange={(e) =>
              setSubFormData((prev) => ({
                ...prev,
                saleType: e.target.value as "group" | "individual" | "all",
              }))
            }
            fullWidth
          >
            <MenuItem value="all">Оба варианта</MenuItem>
            <MenuItem value="group">Для группы</MenuItem>
            <MenuItem value="individual">Индивидуально</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={subFormData.is_active}
                onChange={(e) =>
                  setSubFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
            }
            label="Активна"
            sx={{ color: c.text }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleSubClose} sx={{ textTransform: "none" }}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSubSave}
            disabled={!isSubFormValid || isSubSaving}
            sx={{ textTransform: "none" }}
          >
            {isSubSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления подкатегории */}
      <Dialog
        open={!!deleteSubConfirmId}
        onClose={() => setDeleteSubConfirmId(null)}
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>Удалить подкатегорию?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: c.lightText }}>
            Подкатегория «{deletingSub?.name_ru}» будет удалена. Это действие
            нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteSubConfirmId(null)}
            sx={{ textTransform: "none" }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubDelete}
            sx={{ textTransform: "none" }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог списка размеров */}
      <Dialog
        open={!!sizesDialogSub}
        onClose={handleCloseSizesDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>
          Размеры — {sizesDialogSub?.name_ru}
        </DialogTitle>
        <DialogContent>
          {isSizesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : sizesError ? (
            <Typography sx={{ color: c.error, fontSize: 14, py: 1 }}>
              {sizesError}
            </Typography>
          ) : sizes.length === 0 ? (
            <Typography
              sx={{
                color: c.lightText,
                fontSize: 14,
                py: 2,
                textAlign: "center",
              }}
            >
              Размеры не найдены
            </Typography>
          ) : (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}
            >
              {sizes.map((size) => (
                <Box
                  key={size.id}
                  sx={{
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",

                    backgroundColor: c.surfaceColor,
                    opacity: size.is_active ? 1 : 0.5,
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        minWidth: 0,
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: c.text,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {size.manufacturer_size}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Switch
                        size="small"
                        checked={size.is_active}
                        onChange={() => handleSizeToggle(size.id)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleOpenSizeEdit(size)}
                      >
                        <VuesaxIcon
                          name="edit-2"
                          size={16}
                          stroke={c.primary}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteSizeConfirmId(size.id)}
                      >
                        <VuesaxIcon name="trash" size={16} stroke={c.error} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    {size.order !== undefined && (
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: c.lightText,
                        }}
                      >
                        #{size.order}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: c.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "break-spaces",
                      }}
                    >
                      {sizeLabel(size)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button
            size="small"
            onClick={handleOpenSizeCreate}
            sx={{
              mt: 2,
              textTransform: "none",
              fontSize: 13,
              fontWeight: 500,
              width: "100%",
            }}
          >
            + Добавить размер
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseSizesDialog}
            sx={{ textTransform: "none" }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог создания/редактирования размера */}
      <Dialog
        open={sizeFormOpen}
        onClose={handleSizeFormClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>
          {editingSize ? "Редактировать размер" : "Новый размер"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "8px !important",
          }}
        >
          <Typography
            sx={{ fontSize: 13, color: c.lightText, fontWeight: 500 }}
          >
            Размеры
          </Typography>
          <TextField
            label="Размер производителя"
            value={sizeFormData.manufacturer_size}
            onChange={(e) =>
              setSizeFormData((prev) => ({
                ...prev,
                manufacturer_size: e.target.value,
              }))
            }
            required
            fullWidth
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Размер UA/RU"
              value={sizeFormData.size_ua_ru ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  size_ua_ru: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Размер EU"
              value={sizeFormData.size_eu ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  size_eu: e.target.value,
                }))
              }
              fullWidth
            />
          </Box>

          <Typography
            sx={{ fontSize: 13, color: c.lightText, fontWeight: 500, mt: 1 }}
          >
            Физические параметры
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Рост от (см)"
              type="number"
              value={sizeFormData.height_from ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  height_from:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              fullWidth
            />
            <TextField
              label="Рост до (см)"
              type="number"
              value={sizeFormData.height_to ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  height_to:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              fullWidth
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Длина (см)"
              type="number"
              value={sizeFormData.length ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  length:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              fullWidth
            />
            <TextField
              label="Диаметр (см)"
              type="number"
              value={sizeFormData.diameter ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  diameter:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              fullWidth
            />
          </Box>
          {/* <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Размер ноги"
              value={sizeFormData.foot_size ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  foot_size: e.target.value,
                }))
              }
              fullWidth
            />
          </Box> */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Длина окружности (мм)"
              placeholder="напр. 410-430"
              value={sizeFormData.circumference ?? ""}
              onChange={(e) =>
                setSizeFormData((prev) => ({
                  ...prev,
                  circumference: e.target.value,
                }))
              }
              fullWidth
            />
          </Box>

          <TextField
            label="Порядок сортировки"
            type="number"
            value={sizeFormData.order ?? ""}
            onChange={(e) =>
              setSizeFormData((prev) => ({
                ...prev,
                order:
                  e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={sizeFormData.is_active}
                onChange={(e) =>
                  setSizeFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
            }
            label="Активен"
            sx={{ color: c.text }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleSizeFormClose} sx={{ textTransform: "none" }}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSizeSave}
            disabled={!sizeFormData.manufacturer_size.trim() || isSizeSaving}
            sx={{ textTransform: "none" }}
          >
            {isSizeSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления размера */}
      <Dialog
        open={!!deleteSizeConfirmId}
        onClose={() => setDeleteSizeConfirmId(null)}
        PaperProps={{
          sx: {
            backgroundColor: c.background,
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: c.text }}>Удалить размер?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: c.lightText }}>
            Размер «{deletingSize ? sizeLabel(deletingSize) : ""}» будет удалён.
            Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteSizeConfirmId(null)}
            sx={{ textTransform: "none" }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSizeDelete}
            sx={{ textTransform: "none" }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categories;
