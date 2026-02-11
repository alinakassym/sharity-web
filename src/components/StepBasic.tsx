// src/components/StepBasic.tsx

import type { FC, RefObject } from "react";
import type { Dispatch } from "react";
import { TextField } from "@mui/material";
import ModalSelect from "@/components/ModalSelect";
import { CustomTextField } from "./CustomTextField";

type SelectOption = { value: string; label: string };

type CreateFormState = {
  categoryId: string;
  subcategoryId: string;
  sizeId: string;
  productName: string;
  price: string;
};

type CreateFormAction = {
  type: "SET_FIELD";
  field:
    | "categoryId"
    | "subcategoryId"
    | "sizeId"
    | "productName"
    | "price";
  value: string;
};

type BasicErrors = {
  productName?: string;
  category?: string;
  subcategory?: string;
  size?: string;
  price?: string;
};

interface StepBasicProps {
  form: CreateFormState;
  dispatch: Dispatch<CreateFormAction>;

  basicErrors: BasicErrors;
  clearBasicError: (field: keyof BasicErrors) => void;

  categoryOptions: SelectOption[];
  subcategoryOptions: SelectOption[];
  sizeOptions: SelectOption[];

  showSubcategory: boolean;
  showSize: boolean;

  isLoadingCategories: boolean;
  isLoadingSubcategories: boolean;
  isLoadingSizes: boolean;

  handleCategoryChange: (newCategoryId: string) => void;
  handleSubcategoryChange: (newSubcategoryId: string) => void;
  handleSizeChange: (newSizeId: string) => void;

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
  subcategoryOptions,
  sizeOptions,
  showSubcategory,
  showSize,
  isLoadingCategories,
  isLoadingSubcategories,
  isLoadingSizes,
  handleCategoryChange,
  handleSubcategoryChange,
  handleSizeChange,
  subcategoryInputRef,
  sizeInputRef,
  priceInputRef,
  contentRef,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CustomTextField
        maxSymbols={50}
        label="Название товара *"
        placeholder="Например: Купальник для гимнастики"
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
        value={form.categoryId}
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

      {showSubcategory && (
        <ModalSelect
          searchable
          label="Подкатегория"
          value={form.subcategoryId}
          onChange={handleSubcategoryChange}
          options={subcategoryOptions}
          placeholder={
            isLoadingSubcategories
              ? "Загрузка подкатегорий..."
              : "Выберите подкатегорию"
          }
          disabled={isLoadingSubcategories}
          inputRef={subcategoryInputRef}
          error={Boolean(basicErrors.subcategory)}
          helperText={basicErrors.subcategory}
        />
      )}

      {showSize && (
        <ModalSelect
          label="Размер"
          value={form.sizeId}
          onChange={(value) => {
            handleSizeChange(value);
            setTimeout(() => {
              priceInputRef.current?.focus();
            }, 300);
          }}
          options={sizeOptions}
          placeholder={
            isLoadingSizes ? "Загрузка размеров..." : "Выберите размер"
          }
          disabled={isLoadingSizes}
          searchable
          inputRef={sizeInputRef}
          error={Boolean(basicErrors.size)}
          helperText={basicErrors.size}
        />
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
          // даём клавиатуре открыться, иначе скролл часто "съедается"
          setTimeout(() => {
            contentRef.current?.scrollBy({ top: 124, behavior: "smooth" });
          }, 1850);
        }}
      />
    </div>
  );
};
