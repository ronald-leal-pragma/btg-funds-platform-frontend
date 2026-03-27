const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = process.env.DEV_URL || 'http://localhost:5175'
  console.log('Opening', url)
  await page.goto(url, { waitUntil: 'networkidle' });
  const buttons = await page.$$eval('button', bs => bs.map(b => b.innerText));
  console.log('Buttons count:', buttons.length);
  console.log('Buttons:', buttons.slice(0,20));
  const fundNames = await page.$$eval('p.font-semibold', ns => ns.map(n => n.innerText));
  console.log('Fund names:', fundNames);
  await browser.close();
})();
