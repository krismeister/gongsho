const mimeTypes: Record<string, string> = {
  ts: 'typescript',
  text: 'text',
};

export const getMimeType = (path: string) => {
  const lastDotIndex = path.lastIndexOf('.');
  const extension = lastDotIndex >= 0 ? path.substring(lastDotIndex + 1) : '';
  return mimeTypes[extension] || '';
};
