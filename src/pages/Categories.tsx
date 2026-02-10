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
} from "@mui/material";

const emptyForm: CreateCategoryData = {
  name_ru: "",
  name_en: "",
  icon: "",
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const [formData, setFormData] = useState<CreateCategoryData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const isFormValid = formData.name_ru.trim() && formData.name_en.trim();
  const deletingCategory = categories.find((c) => c.id === deleteConfirmId);

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
            Управление категориями товаров. Добавляйте, редактируйте и
            переключайте активность категорий.
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
            {categories.map((cat) => (
              <Box
                key={cat.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: c.surfaceColor,
                  borderRadius: "12px",
                  opacity: cat.is_active ? 1 : 0.5,
                }}
              >
                {/* Левая часть: иконка + названия */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
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

                {/* Правая часть: switch + edit + delete */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Switch
                    size="small"
                    checked={cat.is_active}
                    onChange={() => handleToggle(cat.id)}
                  />
                  <IconButton size="small" onClick={() => handleOpenEdit(cat)}>
                    <VuesaxIcon name="edit-2" size={18} stroke={c.primary} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteConfirmId(cat.id)}
                  >
                    <VuesaxIcon name="trash" size={18} stroke={c.error} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Диалог создания/редактирования */}
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

      {/* Диалог подтверждения удаления */}
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
    </Container>
  );
};

export default Categories;
