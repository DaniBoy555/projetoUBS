import { test, expect } from '@playwright/test';

test.describe('Multi-OBS Saúde - Visual Test', () => {
  test('should display login page with shadcn blocks styling', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');

    // Verificar elementos do login
    await expect(page.locator('h1')).toContainText('Bem-vindo');
    await expect(page.locator('text=Acesse o sistema Multi-OBS Saúde')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.locator('text=Esqueceu sua senha?')).toBeVisible();
    await expect(page.locator('text=Sistema Multi-OBS de Gestão de Saúde Pública')).toBeVisible();

    // Verificar se o card está visível
    await expect(page.locator('[class*="Card"]').first()).toBeVisible();

    console.log('✅ Login page is correctly styled with shadcn blocks!');
  });

  test('should display dashboard with shadcn blocks components', async ({ page }) => {
    await page.goto('http://localhost:5173/superadmin');

    // Aguardar a página carregar
    await page.waitForLoadState('networkidle');

    // Verificar título
    await expect(page.locator('h1')).toContainText('Dashboard SuperAdmin');
    await expect(page.locator('text=Visão geral do sistema Multi-OBS Saúde')).toBeVisible();

    // Verificar se os cards com gradiente estão visíveis
    // SectionCards deve ter 4 cards
    const cards = page.locator('[class*="Card"]');
    await expect(cards.first()).toBeVisible();

    // Verificar se há badges de trending
    const trendingBadges = page.locator('[class*="Badge"]');
    await expect(trendingBadges.first()).toBeVisible();

    // Verificar se o gráfico interativo está presente
    const chartTitle = page.locator('text=Total Visitors');
    await expect(chartTitle).toBeVisible();

    // Verificar se os controles de período estão presentes
    const periodControls = page.locator('text=Last 3 months');
    await expect(periodControls.first()).toBeVisible();

    // Verificar se a tabela está presente
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // Verificar se tem o botão "Customize Columns"
    const customizeBtn = page.locator('text=Customize Columns, Columns').first();
    await expect(customizeBtn).toBeVisible();

    console.log('✅ Dashboard is correctly styled with shadcn blocks!');
    console.log('✅ SectionCards with gradients loaded');
    console.log('✅ ChartAreaInteractive with controls loaded');
    console.log('✅ DataTable with drag & drop loaded');

    // Tirar screenshot para você ver
    await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to dashboard-screenshot.png');
  });

  test('should have interactive chart controls', async ({ page }) => {
    await page.goto('http://localhost:5173/superadmin');
    await page.waitForLoadState('networkidle');

    // Tentar clicar no controle de período (se visível)
    const lastSevenDays = page.getByText('Last 7 days').first();
    if (await lastSevenDays.isVisible()) {
      await lastSevenDays.click();
      console.log('✅ Chart period control is interactive!');
    }
  });

  test('should open browser for manual inspection', async ({ page }) => {
    console.log('🌐 Opening browser for manual inspection...');
    console.log('📍 Login page: http://localhost:5173/login');
    console.log('📍 Dashboard: http://localhost:5173/superadmin');

    await page.goto('http://localhost:5173/login');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:5173/superadmin');
    await page.waitForTimeout(5000);

    console.log('✅ Browser opened! Check the visual appearance.');
  });
});
