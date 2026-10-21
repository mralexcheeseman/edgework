"""Builds the Edgework mark library into public/marks from the Recraft source scans.

Each stain was generated as a flatbed scan on white paper. The paper is removed by
"un-multiplying" against a local estimate of the paper colour, so the mark keeps its
own translucency and sits on any paper. Run: PYTHONPATH=/tmp/pylib python3 scripts/build-marks.py
"""
import io
import os
import urllib.request

import numpy as np
from PIL import Image, ImageFilter

OUT = 'public/marks'
MAX = 1600
R = 'https://img.recraft.ai/'

# name: (url, crop box in coordinates of a preview of width w, or None)
SCANS = {
    'coffee-1': (R + 'hww8d0dtKDyRXNH06uHYHCBKTxCHGCHWgv2vpQ-vm48/raw:1/plain/abs://prod/images/8f6cb926-17b0-4508-aad7-8fafd7c29708', None),
    'coffee-2': (R + 'kRn-t_-M9pXzT11kFOlBJY6Zwq5YZYKnv4b_WeyBlGk/raw:1/plain/abs://prod/images/2249fc1c-6dc4-42ef-83f0-acedbf50415a', None),
    'coffee-3': (R + 'gynkz9pK2Uetm1Eu2NjLkGfg8X6Uw0b03UXJaRz05Kg/raw:1/plain/abs://prod/images/138b9947-088f-4912-a8b7-261c5d23c93a', None),
    'coffee-4': (R + 'n_M8PM7KRtEfTK96oLOgt1PmzJX3-D0DH2wp5nwo1RE/raw:1/plain/abs://prod/images/dc874571-9db6-4246-939d-a0edea176514', None),
    'coffee-5': (R + 'Ys8efGdXcPgoiTKC5kL_wOwmPY68htUQIyq5WCVYmsM/raw:1/plain/abs://prod/images/3e723fd7-fd68-4404-a4d3-4e51769b5e2b', None),
    'splat-1': (R + 'ZILc9mDfTo9Ysu7G8paCKsLEnv_ATX02yl_8FeFSpME/raw:1/plain/abs://prod/images/71c663da-422c-4208-9250-e38c9bae633b', None),
    'splat-2': (R + 'H2sBL6MxnociSfopFzLcPklWmNrHvUf-maCqz4xMtoU/raw:1/plain/abs://prod/images/c43463c6-47b3-4056-8ad7-0d4934bc4cb9', None),
    'splat-3': (R + 'X5kJb55P1xqhVBix6DuE4C-wshneUcYEfPNcbuuWbWU/raw:1/plain/abs://prod/images/6b82a1f9-2524-4fdb-aed1-d2cc38043d01', None),
    'splat-4': (R + 'jcrq8Nnf6PXW0693v_h5cI03jMSPNKCDcKDydNbX_s8/raw:1/plain/abs://prod/images/a41b5f67-1a2d-45ae-b835-033f227fdfd7', None),
    'smudge-1': (R + 'nKdA09yxWKO7Qfby4_aC4IwSEfiSVKaxz5yCwgoXCXg/raw:1/plain/abs://prod/images/49834062-9175-4c07-b9c0-530ad8f7830d', None),
    'smudge-2': (R + 'zW1TVXBgjYBqB1BqV_Q7cqMIUVPVn_V4krzWBkDI_VU/raw:1/plain/abs://prod/images/8d47bdc0-7811-4e66-9302-415786041c07', None),
    'smudge-3': (R + 'fadaL2tkOJ8DoO8W_kD6GE4FPnxZqAqMjKuUeh0rNio/raw:1/plain/abs://prod/images/11a8aaba-937c-4499-a2ba-a288f517ff42', None),
    'burn-1': (R + 'lavArEt2xiTpD4gcuYi1xSU8-ImAoNLBnRkWlnXEFSU/raw:1/plain/abs://prod/images/ea235e36-c73f-41d3-a309-b3ac319850ea', None),
    'burn-2': (R + 'OnFZ_rfhUYkaKJfX8GheSebLpv6oy_52n2YyeKESqLk/raw:1/plain/abs://prod/images/06d865e3-5ae0-4cd1-9e25-6c7630d9c5bb', None),
    'highlight-1': (R + 'Xmm5pv8jA5gwl660uzYRmYeB5tt6gIvOG_BUCg3UHb4/raw:1/plain/abs://prod/images/798d5672-0f08-41ec-a6ff-6bcf30b8abf3', (1536, (150, 232, 1380, 350))),
    'highlight-2': (R + 'ektMod73RV91ebA2rnWBoDXTdgQA29oyjSaJiBMCmcA/raw:1/plain/abs://prod/images/0ff0fe45-5517-47a6-b2a4-6aed33048d37', None),
    'highlight-3': (R + 'CIuvC2h7dUhdkUyJ6n04ib2x3VWvusHpYELI_7oakjE/raw:1/plain/abs://prod/images/e9db6ea0-a7f6-4fe6-82d3-08ea30ac71ee', None),
    'pen-circle': (R + '7zaVYt8rR4fQD_hQs4j1_5FmHxP_Cj3Ha6Xm4ueWudk/raw:1/plain/abs://prod/images/471a1ba4-e925-4869-8a9f-1af19b399d83', (512, (30, 50, 175, 215))),
    'pen-lines': (R + '7zaVYt8rR4fQD_hQs4j1_5FmHxP_Cj3Ha6Xm4ueWudk/raw:1/plain/abs://prod/images/471a1ba4-e925-4869-8a9f-1af19b399d83', (512, (235, 30, 480, 200))),
    'pen-arrow': (R + '7zaVYt8rR4fQD_hQs4j1_5FmHxP_Cj3Ha6Xm4ueWudk/raw:1/plain/abs://prod/images/471a1ba4-e925-4869-8a9f-1af19b399d83', (512, (55, 280, 190, 465))),
    'pen-scribble': (R + '7zaVYt8rR4fQD_hQs4j1_5FmHxP_Cj3Ha6Xm4ueWudk/raw:1/plain/abs://prod/images/471a1ba4-e925-4869-8a9f-1af19b399d83', (512, (230, 200, 495, 455))),
    'pen-loop': (R + 'Bv_8v1bBe1U6WzdYrLgJq_dsV_q6LXcWQDXUWfWfVjw/raw:1/plain/abs://prod/images/9ab127d9-87e5-4d7c-ab5b-9f253b5ab458', (512, (60, 50, 185, 180))),
    'pen-arrow-2': (R + 'Bv_8v1bBe1U6WzdYrLgJq_dsV_q6LXcWQDXUWfWfVjw/raw:1/plain/abs://prod/images/9ab127d9-87e5-4d7c-ab5b-9f253b5ab458', (512, (50, 265, 220, 385))),
    'heyrube-letterpress': (R + 'Lqz9p3-WOIXgQImA8-fIsbfDqklp5vCnh5Az-spq33E/raw:1/plain/abs://prod/images/094405d0-e497-4d97-8891-a3ac8bd807e7', None),
    'heyrube-stamp': (R + 'SQQp00CwSkOkpe9MqCS9p1SV1qs4ua-5oWIAifM5Hd4/raw:1/plain/abs://prod/images/50e7f373-4ba2-4255-9497-667dca23a786', None),
}
# Already cut out by background removal: keep the alpha, soften slightly.
TAPES = {
    'tape-1': R + 'SwK8JdtyxzxprxNl5sMSRzM-oGML67tHpY3Zrpk2320/raw:1/plain/abs://prod/images/c5a2f281-dad7-446c-915e-39c683586eee',
    'tape-2': R + 'rr95ZKMCvUzCTvQx7aLkmZFPtcxpvyyVfTzMq3fPpHg/raw:1/plain/abs://prod/images/8270846a-3c19-4dec-8262-319d9688dffa',
    'tape-3': R + 'k0f-63ArhASXMKlN8ch9vlqfpYjKgEt9GcWTzwydvYo/raw:1/plain/abs://prod/images/9c7fdf2b-eb23-46b2-bf98-f997b4ecf3d9',
}
PAPER = R + 'Dvgy7M-zkM9HkLRbFJ0jSoOjS8ghd8mmTm744LpkDRY/raw:1/plain/abs://prod/images/f9e787dd-a4d3-4be7-9554-dd6cd0dd1ce6'
LETTERPRESS = R + 'lK2--4dAFVo3MnNHj9Zi6MWghw-L9IdE_a1uqbA64FI/raw:1/plain/abs://prod/images/6595d1b0-4671-43ab-bb05-48c5bbe3e50c'


def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return Image.open(io.BytesIO(r.read()))


def unmultiply(img):
    img = img.convert('RGB')
    w, h = img.size
    im = np.asarray(img).astype(np.float32)
    small = img.resize((48, max(1, int(48 * h / w))), Image.BILINEAR)
    bg = small.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3)).resize((w, h), Image.BICUBIC)
    paper = np.asarray(bg).astype(np.float32) + 2
    c = np.clip(im / paper, 0, 1)
    a = 1 - c.min(axis=2)
    a = np.clip((a - 0.10) / 0.90, 0, 1)
    yy, xx = np.mgrid[0:h, 0:w]
    e = np.minimum(np.minimum(xx, w - 1 - xx) / (0.06 * w), np.minimum(yy, h - 1 - yy) / (0.06 * h))
    a = a * np.clip(e, 0, 1)
    rgb = np.where(a[..., None] > 0, (c - (1 - a[..., None])) / np.maximum(a[..., None], 1e-4), 0)
    out = np.dstack([np.clip(rgb, 0, 1) * 255, a * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def trim(img, pad=16):
    bb = img.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    if not bb:
        return img
    return img.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(img.width, bb[2] + pad), min(img.height, bb[3] + pad)))


def fit(img, size=MAX):
    s = min(1, size / max(img.size))
    return img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS) if s < 1 else img


os.makedirs(OUT, exist_ok=True)
cache = {}
for name, (url, crop) in SCANS.items():
    if url not in cache:
        src = fetch(url).convert('RGB')
        src = src.resize((2400, round(2400 * src.height / src.width)), Image.LANCZOS)
        cache[url] = unmultiply(src)
    img = cache[url]
    if crop:
        pw, (a, b, c, d) = crop
        f = img.width / pw
        img = img.crop((round(a * f), round(b * f), round(c * f), round(d * f)))
    fit(trim(img)).save(f'{OUT}/{name}.webp', quality=88, method=6)
    print(name)

for name, url in TAPES.items():
    t = fetch(url).convert('RGBA')
    t.putalpha(t.getchannel('A').point(lambda v: int(v * 0.9)))
    fit(t.crop(t.getchannel('A').getbbox())).save(f'{OUT}/{name}.webp', quality=88, method=6)
    print(name)

paper = fetch(PAPER).convert('RGB')
for label, size in (('paper-45', (1080, 1350)), ('paper-916', (1080, 1920))):
    from PIL import ImageOps
    ImageOps.fit(paper, size, Image.LANCZOS).save(f'{OUT}/{label}.jpg', quality=88)
    print(label)

lp = fetch(LETTERPRESS).convert('RGB')
lp = lp.crop((round(lp.width * 90 / 768), round(lp.height * 70 / 384), round(lp.width * 680 / 768), round(lp.height * 290 / 384)))
arr = np.asarray(lp).astype(np.float32)
ink = np.clip((255 - arr[..., 1]) / 200, 0, 1)
ink = np.clip((ink - 0.15) / 0.6, 0, 1)
mask = np.dstack([np.full(ink.shape, 255), np.full(ink.shape, 255), np.full(ink.shape, 255), ink * 255]).astype(np.uint8)
Image.fromarray(mask, 'RGBA').save(f'{OUT}/letterpress-mask.png', optimize=True)
print('letterpress-mask')
