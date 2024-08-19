export const changeGptComment = (comment: string) => {
  console.log("changeGptComment")
  const items = comment
    .split(/\d+\.\s+/)
    .filter((item) => item.trim() !== "")
    .map((item) => item.trim());
  return items;
};
