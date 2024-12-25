import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:8888";

test("has title", async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Mark Fisher Photography/);
});

[
    "/",
    "/explore",
    "/about",
    "/contact",
    "/highlands/",
    "/highlands/tangle",
].forEach((slug) => {
    const url = `${baseURL}${slug}`;
    test(`No console errors/warnings on ${url}`, async ({ page }) => {
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

    test(`No network errors on ${url}`, async ({ page }) => {
        const failedRequests: {
            url: string;
            status: number;
        }[] = [];
        page.on("response", (response) => {
            if (response.status() !== 200) {
                console.error(`${response.status()} response for ${response.url()}`);
                failedRequests.push({
                    url: response.url(),
                    status: response.status(),
                });
            }
        });
        await page.goto(url);
        expect(failedRequests).toHaveLength(0);
    });

    test(`All images on ${url} have alt text`, async ({ page }) => {
        await page.goto(url);
        const images = await page.$$("img");
        for (const image of images) {
            const alt = await image.getAttribute("alt");
            expect(alt, `Image with src ${await image.getAttribute("src")} has no alt attribute`).not.toBeNull();
        }
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
    await expect(successMessage).toBeInViewport();
});

test("can't submit with invalid email", async ({ page }) => {
    await page.goto(`${baseURL}/contact`);

    await page.getByLabel("Name").fill("Playwright");
    await page.getByLabel("Email").fill("playwrightexample.com");
    await page.getByLabel("how can i help you").fill("Hello, World!");

    await page.focus("button[type=submit]");

    const errorMessage = await page.getByText("Please fill out all the fields correctly");
    await expect(errorMessage).toBeAttached();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toBeInViewport();
});

test("can't submit with empty message", async ({ page }) => {
    await page.goto(`${baseURL}/contact`);
    await page.getByLabel("Name").fill("Playwright");
    await page.getByLabel("Email").fill("playwright@example.com");
    await page.getByLabel("how can i help you").fill("");
    await page.click("button[type=submit]");
    const errorMessage = await page.getByText("Please fill out all the fields correctly");
    await expect(errorMessage).toBeAttached();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toBeInViewport();
});
