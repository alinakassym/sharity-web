// sharity-web/src/components/StepBasic.tsx

import type { FC, RefObject } from "react";
import type { Dispatch } from "react";
import { TextField } from "@mui/material";
import ModalSelect from "@/components/ModalSelect";

type SelectOption = { value: string; label: string };

type CreateFormState = {
  category: string;
  subcategory: string;
  productSize: string;
  productName: string;
  price: string;
};

type CreateFormAction = {
  type: "SET_FIELD";
  field: "category" | "subcategory" | "productSize" | "productName" | "price";
  value: string;
};

type BasicErrors = {
  productName?: string;
  category?: string;
  subcategory?: string;
  productSize?: string;
  price?: string;
};

interface StepBasicProps {
  form: CreateFormState;
  dispatch: Dispatch<CreateFormAction>;

  basicErrors: BasicErrors;
  clearBasicError: (field: keyof BasicErrors) => void;

  categoryOptions: SelectOption[];
  gymnasticsSubcategoryOptions: SelectOption[];
  leotardSizeOptions: SelectOption[];

  isLoadingCategories: boolean;
  isLoadingGymnasticsCategories: boolean;
  isLoadingLeotardSizes: boolean;

  handleCategoryChange: (newCategory: string) => void;
  handleSubcategoryChange: (newSubcategory: string) => void;

  subcategoryInputRef: RefObject<HTMLInputElement | null>;
  sizeInputRef: RefObject<HTMLInputElement | null>;
  priceInputRef: RefObject<HTMLInputElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const StepBasic: FC<StepBasicProps> = ({
  form,
  dispatch,
  basicErrors,
  clearBasicError,
  categoryOptions,
  gymnasticsSubcategoryOptions,
  leotardSizeOptions,
  isLoadingCategories,
  isLoadingGymnasticsCategories,
  isLoadingLeotardSizes,
  handleCategoryChange,
  handleSubcategoryChange,
  subcategoryInputRef,
  sizeInputRef,
  priceInputRef,
  contentRef,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextField
        label="Название товара *"
        placeholder="Введите название товара"
        value={form.productName}
        onChange={(e) => {
          clearBasicError("productName");
          dispatch({
            type: "SET_FIELD",
            field: "productName",
            value: e.target.value,
          });
        }}
        error={Boolean(basicErrors.productName)}
        helperText={basicErrors.productName}
        fullWidth
        variant="outlined"
      />

      <ModalSelect
        searchable
        label="Категория"
        value={form.category}
        onChange={handleCategoryChange}
        options={categoryOptions}
        placeholder={
          isLoadingCategories ? "Загрузка категорий..." : "Выберите категорию"
        }
        disabled={isLoadingCategories}
        required
        error={Boolean(basicErrors.category)}
        helperText={basicErrors.category}
      />

      {form.category === "Гимнастика" && (
        <>
          <ModalSelect
            searchable
            label="Подкатегория"
            value={form.subcategory}
            onChange={handleSubcategoryChange}
            options={gymnasticsSubcategoryOptions}
            placeholder={
              isLoadingGymnasticsCategories
                ? "Загрузка подкатегорий..."
                : "Выберите подкатегорию"
            }
            disabled={isLoadingGymnasticsCategories}
            inputRef={subcategoryInputRef}
            error={Boolean(basicErrors.subcategory)}
            helperText={basicErrors.subcategory}
          />
        </>
      )}

      {form.category === "Гимнастика" && form.subcategory === "Купальник" && (
        <>
          <ModalSelect
            label="Размер"
            value={form.productSize}
            onChange={(value) => {
              clearBasicError("productSize");
              dispatch({ type: "SET_FIELD", field: "productSize", value });
              setTimeout(() => {
                priceInputRef.current?.focus();
              }, 300);
            }}
            options={leotardSizeOptions}
            placeholder={
              isLoadingLeotardSizes ? "Загрузка размеров..." : "Выберите размер"
            }
            disabled={isLoadingLeotardSizes}
            searchable
            inputRef={sizeInputRef}
            error={Boolean(basicErrors.productSize)}
            helperText={basicErrors.productSize}
          />
        </>
      )}

      <TextField
        label="Цена *"
        placeholder="0"
        type="number"
        inputMode="numeric"
        value={form.price}
        onChange={(e) => {
          clearBasicError("price");
          dispatch({
            type: "SET_FIELD",
            field: "price",
            value: e.target.value,
          });
        }}
        error={Boolean(basicErrors.price)}
        helperText={basicErrors.price || "Укажите цену в тенге"}
        slotProps={{ htmlInput: { pattern: "[0-9]*" } }}
        fullWidth
        variant="outlined"
        inputRef={priceInputRef}
        onFocus={() => {
          // даём клавиатуре открыться, иначе скролл часто “съедается”
          setTimeout(() => {
            contentRef.current?.scrollBy({ top: 124, behavior: "smooth" });
          }, 1850);
        }}
      />
    </div>
  );
};
