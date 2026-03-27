import { test, expect } from '@playwright/test'

test('flujo suscripción/cancelación y transacciones', async ({ page }) => {
  // Abrir la app
  await page.goto('http://localhost:5173')

  // Verificar que el backend responde (diagnóstico rápido)
  const resp = await page.request.get('http://localhost:8081/api/v1/client')
  await expect(resp.ok()).toBeTruthy()

  // Capturar logs de la página para diagnóstico
  const logs: string[] = []
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`))
  page.on('pageerror', e => logs.push(`pageerror: ${e.message}`))

  // Pequeña espera para permitir que la app cargue y genere logs
  await page.waitForTimeout(2000)
  if (logs.length) console.log('PAGE LOGS:\n' + logs.join('\n'))

  // Esperar que la UI muestre el saldo (la app hace la petición por sí misma)
  await expect(page.locator('text=Saldo disponible')).toBeVisible({ timeout: 30000 })

  // Tomar la primera tarjeta de fondo y pulsar el botón (Suscribirse/Cancelar)
  const fundCard = page.locator('main .grid > div').first()
  const actionBtn = fundCard.locator('button').first()
  const actionText = (await actionBtn.innerText()).toLowerCase()

  // Esperar la respuesta de la API al hacer la acción
  const waitApi = page.waitForResponse(r => r.url().includes('/api/v1/funds') && (r.request().method() === 'POST' || r.request().method() === 'DELETE'))
  await actionBtn.click()
  await waitApi

  // Ir a Transacciones
  await page.click('text=Transacciones')
  await expect(page.locator('text=Historial de Transacciones')).toBeVisible()

  // Verificar que existe al menos una transacción (Suscripción o Cancelación)
  const countA = await page.locator('text=Suscripción').count()
  const countC = await page.locator('text=Cancelación').count()
  if (countA + countC === 0) {
    throw new Error('No se encontró ninguna transacción en TransactionsPage')
  }
})
