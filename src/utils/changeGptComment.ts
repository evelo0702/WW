export const changeGptComment = (comment: string) => {
  const items = comment
    .split(/\d+\.\s+/)
    .filter((item) => item.trim() !== "")
    .map((item) => item.trim());
  return items;
};
