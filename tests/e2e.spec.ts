import { test, expect } from '@playwright/test'

test('flujo suscripción/cancelación y transacciones', async ({ page }) => {
  // Abrir la app
  // Use dev port from env if provided, otherwise default to 5175 (current dev server)
  const devPort = process.env.DEV_PORT ?? '5175'
  await page.goto(`http://localhost:${devPort}`)

  // (No navegar aún) comprobaremos/crearemos el cliente y luego iremos a Fondos

  // Verificar que el backend responde (diagnóstico rápido). Aceptar 400 (cliente no encontrado).
  const resp = await page.request.get('http://localhost:8081/api/v1/client/1')
  if (!resp.ok() && resp.status() !== 400) {
    throw new Error(`Backend no responde correctamente: ${resp.status()}`)
  }

  // Capturar logs de la página para diagnóstico
  const logs: string[] = []
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`))
  page.on('pageerror', e => logs.push(`pageerror: ${e.message}`))

  // Pequeña espera para permitir que la app cargue y genere logs
  await page.waitForTimeout(2000)
  if (logs.length) console.log('PAGE LOGS:\n' + logs.join('\n'))

  // Si el cliente no existe, crear cuenta desde la UI
  await page.click('text=Cliente')
  if (await page.locator('text=Crear cuenta').isVisible({ timeout: 2000 }).catch(() => false)) {
    // rellenar formulario mínimo y crear cliente
    await page.fill('input[placeholder="usuario@email.com"]', 'test@example.com')
    const createRespP = page.waitForResponse(r => r.url().includes('/api/v1/client') && r.request().method() === 'POST')
    await page.click('text=Crear cuenta')
    await createRespP
    // esperar que perfil se muestre
    await expect(page.locator('text=Mi Perfil')).toBeVisible({ timeout: 10000 })
    // volver a Fondos
    await page.click('text=Fondos')
  }

  // Asegurar que estamos en la vista de Fondos (en caso de que ya existiera el cliente)
  await page.click('text=Fondos')

  // Esperar que la UI muestre el saldo (la app hace la petición por sí misma)
  await expect(page.locator('text=Saldo disponible')).toBeVisible({ timeout: 30000 })

  // Tomar la primera tarjeta de fondo y pulsar el botón (Suscribirse/Cancelar)
  const actionBtn = page.locator('button:has-text("Suscribirse"), button:has-text("Cancelar")').first()
  const hasAction = await actionBtn.isVisible({ timeout: 5000 }).catch(() => false)
  if (!hasAction) {
    const allButtons = await page.$$eval('button', bs => bs.map(b => b.innerText))
    console.log('DEBUG: botones en la página:', allButtons)
    const fundNames = await page.$$eval('p.font-semibold', ns => ns.map(n => n.innerText))
    console.log('DEBUG: nombres de fondos:', fundNames)
    throw new Error('No se encontró ningún botón de acción de fondo (Suscribirse/Cancelar); verifica /api/v1/funds')
  }
  const actionText = (await actionBtn.innerText()).toLowerCase()

  // Esperar la respuesta de la API al hacer la acción
  const waitApi = page.waitForResponse(r => r.url().includes('/api/v1/funds') && (r.request().method() === 'POST' || r.request().method() === 'DELETE'))
  await actionBtn.click()
  await waitApi

  // Ir a Transacciones
  await page.click('text=Transacciones')
  await expect(page.locator('text=Historial de Transacciones')).toBeVisible()

  // Verificar que existe al menos una transacción (APERTURA o CANCELACION)
  const countA = await page.locator('text=APERTURA').count()
  const countC = await page.locator('text=CANCELACION').count()
  if (countA + countC === 0) {
    throw new Error('No se encontró ninguna transacción en TransactionsPage')
  }
})
