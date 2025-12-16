/**
 * Генерирует читаемый номер заказа в формате YYMMDD-XXXXX
 * Например: 251216-88799
 *
 * @returns Уникальный номер заказа
 */
export const generateOrderNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const timestamp = Date.now().toString();
  const uniqueId = timestamp.slice(-5); // последние 5 цифр timestamp

  return `${year}${month}${day}-${uniqueId}`;
};
