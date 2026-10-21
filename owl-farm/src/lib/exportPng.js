import { toBlob } from 'html-to-image';

// Captures a rendered Edgework card at its full export size. html-to-image draws the
// node through the browser itself, so blend modes, masks and web fonts come out as seen.
export async function renderNodePng(node, width, height) {
  await document.fonts.ready;
  const options = { width, height, pixelRatio: 1, cacheBust: true, style: { transform: 'none' } };
  // The first pass warms the image and font cache; the second is the clean capture.
  await toBlob(node, options);
  return toBlob(node, options);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
