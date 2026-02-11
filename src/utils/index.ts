// sharity-web/src/utils/index.ts

export const moveSelectedToStart = <T>(
  array: T[],
  selectedIndex: number,
): T[] => {
  if (selectedIndex < 0 || selectedIndex >= array.length) {
    return array;
  }

  const selected = array[selectedIndex];

  return [
    selected,
    ...array.slice(0, selectedIndex),
    ...array.slice(selectedIndex + 1),
  ];
};

export const stripUndefined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
