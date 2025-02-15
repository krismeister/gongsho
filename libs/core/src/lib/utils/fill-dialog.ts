export const fillDialog = (
  dialogue: string,
  fillValues: Record<string, string>
) => {
  return dialogue.replace(/{{(.*?)}}/g, (match, p1) => {
    return fillValues[p1] || match;
  });
};
