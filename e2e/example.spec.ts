import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:8888";

test("has title", async ({ page }) => {
    await page.goto("http://localhost:8888");
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
    await page.goto("http://localhost:8888/contact");
    await page.getByLabel("Name").fill("Playwright");
    await page.getByLabel("Email").fill("playwright@example.com");
    await page.getByLabel("how can i help you").fill("Hello, World!");
    await page.click("button[type=submit]");
    const successMessage = await page.getByText("Your message has been sent!");
    expect(successMessage).toBeAttached();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(successMessage).toBeVisible();
});

/**
 * TODO this fails in webkit, and also Chromium, unless using --ui option
 * Also, this should work with just fill(), and not focus/blur, since this is
 * strictly equivalent to some a11y-specific input methods that insert text directly
 */
test.skip("can't submit with invalid email", async ({ page }) => {
    await page.goto("http://localhost:8888/contact");

    const nameField = page.getByLabel("Name");
    await nameField.focus();
    await nameField.fill("Playwright");
    await nameField.blur();

    const emailField = page.getByLabel("Email");
    await emailField.focus();
    await emailField.fill("playwrightexample.com");
    await emailField.blur();

    const messageField = page.getByLabel("how can i help you");
    await messageField.focus();
    await messageField.fill("Hello, World!");
    await messageField.blur();

    await page.focus("button[type=submit]");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const errorMessage = await page.getByText("Please fill out all the fields correctly");
    expect(errorMessage).toBeAttached();
    expect(errorMessage).toBeVisible();
});
