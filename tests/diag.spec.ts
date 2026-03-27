import { test } from '@playwright/test'

test('diagnóstico: capturar logs y HTML', async ({ page }) => {
  const logs: string[] = []
  page.on('console', m => logs.push(`console:${m.type()}: ${m.text()}`))
  page.on('pageerror', e => logs.push(`pageerror: ${e.message}`))

  await page.goto('http://localhost:5174')
  await page.waitForTimeout(1500)

  // Capturar HTML del root
  const html = await page.locator('#root').innerHTML().catch(() => '')
  console.log('ROOT_HTML:\n', html)

  if (logs.length) console.log('PAGE_LOGS:\n' + logs.join('\n'))
})
