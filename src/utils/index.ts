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
