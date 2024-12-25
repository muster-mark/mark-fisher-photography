import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:8888";

test("has title", async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Mark Fisher Photography/);
});

[
    baseURL,
    `${baseURL}/explore`,
    `${baseURL}/about`,
    `${baseURL}/contact`,
    `${baseURL}/highlands`,
    `${baseURL}/highlands/tangle`,
].forEach((url) => {
    test(`no console errors/warnings on ${url}`, async ({ page }) => {
        const errors: string[] = [];
        const warnings: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") {
                errors.push(msg.text());
            } else if (msg.type() === "warning") {
                warnings.push(msg.text());
            }
        });
        await page.goto(url);
        expect(errors).toHaveLength(0);
    });
});

test("can submit contact form", async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    await page.getByLabel("Name").fill("Playwright");
    await page.getByLabel("Email").fill("playwright@example.com");
    await page.getByLabel("how can i help you").fill("Hello, World!");
    await page.click("button[type=submit]");
    const successMessage = await page.getByText("Your message has been sent!");
    await expect(successMessage).toBeAttached();
    await expect(successMessage).toBeVisible();
});

test("can't submit with invalid email", async ({ page }) => {
    await page.goto(`${baseURL}/contact`);

    const nameField = page.getByLabel("Name");
    await nameField.fill("Playwright");

    const emailField = page.getByLabel("Email");
    await emailField.fill("playwrightexample.com");

    const messageField = page.getByLabel("how can i help you");
    await messageField.fill("Hello, World!");

    await page.focus("button[type=submit]");

    const errorMessage = await page.getByText("Please fill out all the fields correctly");
    await expect(errorMessage).toBeAttached();
    await expect(errorMessage).toBeVisible();
});
