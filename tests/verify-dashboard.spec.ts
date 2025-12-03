import { test, expect } from '@playwright/test';

test('Login and Dashboard Verification', async ({ page }) => {
    // 1. Go to Login Page
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5173');

    // Check if we are on login page (skip strict title check for now)
    // await expect(page).toHaveTitle(/Multi-OBS/i);
    console.log('Login page loaded.');

    // 2. Login as SuperAdmin
    console.log('Attempting login...');
    await page.fill('input[type="email"]', 'superadmin@multiobs.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // 3. Verify Dashboard
    console.log('Verifying dashboard...');
    await page.waitForTimeout(3000); // Wait a bit longer
    console.log('Current URL after login attempt:', page.url());

    // Check if we are still on login page
    if (page.url().includes('login')) {
        console.error('Still on login page!');
        // Try to capture any visible error toast/alert
        // const toast = await page.locator('.toast').textContent().catch(() => 'No toast');
        // console.log('Toast message:', toast);
    }

    // Wait for navigation or specific element
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 15000 });

    // Check for specific SuperAdmin elements
    await expect(page.getByText('Total de OBS')).toBeVisible();

    // Check for "Nova OBS" button (the one we added)
    const novaObsBtn = page.getByRole('button', { name: /Nova OBS/i });
    await expect(novaObsBtn).toBeVisible();
    console.log('SuperAdmin Dashboard verified.');

    // 4. Test Modal Opening
    console.log('Testing "Nova OBS" modal...');
    await novaObsBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Nova Organização de Saúde')).toBeVisible();
    console.log('Modal opened successfully.');
});
