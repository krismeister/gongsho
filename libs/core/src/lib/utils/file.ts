import crypto from 'crypto';

const mimeTypes: Record<string, string> = {
  // Programming Languages
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  py: 'python',
  sh: 'bash',

  // Markup and Styles
  html: 'html',
  css: 'css',
  scss: 'css',
  less: 'css',
  sass: 'css',
  stylus: 'css',

  // Data Formats
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',

  // Other Formats
  text: 'text',
  md: 'markdown',
  xml: 'xml'
};

export const getMimeType = (path: string) => {
  const lastDotIndex = path.lastIndexOf('.');
  const extension = lastDotIndex >= 0 ? path.substring(lastDotIndex + 1) : '';
  return mimeTypes[extension] || '';
};

export const getContentsForLlmMessage = (relativePath: string, contents: string) => {
  const mimeType = getMimeType(relativePath);
  return `${relativePath}
\`\`\`${mimeType}
${contents}
\`\`\``;
}

export const calculateChecksum = (contents: string) => {
  return crypto.createHash('md5').update(contents).digest('hex');
}