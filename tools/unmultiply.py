import sys, numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
h, w, _ = im.shape
from PIL import ImageFilter
small = Image.open(src).convert('RGB').resize((48, max(1, int(48*h/w))), Image.BILINEAR)
bgf = small.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3)).resize((w, h), Image.BICUBIC)
paper = np.asarray(bgf).astype(np.float32) + 2
c = np.clip(im / paper, 0, 1)
a = 1 - c.min(axis=2)
a = np.clip((a - 0.10) / 0.90, 0, 1)
yy, xx = np.mgrid[0:h, 0:w]
e = np.minimum(np.minimum(xx, w - 1 - xx) / (0.06 * w), np.minimum(yy, h - 1 - yy) / (0.06 * h))
a = a * np.clip(e, 0, 1)
rgb = np.where(a[..., None] > 0, (c - (1 - a[..., None])) / np.maximum(a[..., None], 1e-4), 0)
rgb = np.clip(rgb, 0, 1)
out = np.dstack([rgb * 255, a * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(dst)
print(dst, w, h)
