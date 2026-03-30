import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; }
  body { width: 512px; height: 512px; }
  .icon {
    width: 512px; height: 512px;
    background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%);
    border-radius: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 280px;
    position: relative;
    overflow: hidden;
  }
  .icon::before {
    content: '';
    position: absolute;
    top: 60px; right: 60px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(232, 146, 124, 0.15);
  }
  .icon::after {
    content: '';
    position: absolute;
    bottom: 80px; left: 50px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(123, 175, 212, 0.15);
  }
</style></head>
<body><div class="icon">🎨</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
await page.setContent(html);

const buf512 = await page.screenshot({ type: 'png', omitBackground: true });
writeFileSync('public/icons/icon-512.png', buf512);

await page.setViewportSize({ width: 192, height: 192 });
await page.setContent(html.replaceAll('512', '192').replace('96px', '36px').replace('280px', '105px').replace('60px', '22px').replace('120px', '45px').replace('80px; left: 50px', '30px; left: 19px').replace('80px;', '30px;'));
const buf192 = await page.screenshot({ type: 'png', omitBackground: true });
writeFileSync('public/icons/icon-192.png', buf192);

await browser.close();
console.log('Icons generated!');
