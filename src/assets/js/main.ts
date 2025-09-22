import { createApp } from "vue";

import explore from "./pages/explore.vue";
import contact from "./pages/contact.vue";

require("../css/main.scss");

// Needed for dynamic imports to work (though not currently used), otherwise they will load /public/0.js instead of /assets/0.js for example
//@ts-expect-error
__webpack_public_path__ = "assets/";

const appElement = document.getElementById("explore-app");

if (appElement) {
    createApp(explore).mount(appElement);
}

const contactElement = document.getElementById("contact-app");
if (contactElement) {
    createApp(contact).mount(contactElement);
}

async function consoleSurprise() {
    const isFirefox = /firefox/i.test(navigator.userAgent);
    const { color, backgroundColor } = getComputedStyle(document.body);
    const height = 60;

    const svgText = await fetch("/favicon.svg", { priority: "low" }).then((response) => response.text());
    const svg = new DOMParser().parseFromString(svgText, "image/svg+xml").documentElement;
    svg.setAttribute("width", `${height}`);
    svg.setAttribute("height", `${height}`);

    const style = document.createElement("div").style;
    style.fontSize = "1.5em";
    style.backgroundColor = backgroundColor;
    style.color = color;
    style.lineHeight = `${height}px`;
    style.paddingBlock = isFirefox ? `${height / 2}px` : "0";
    style.paddingLeft = "70px";
    style.paddingRight = "10px";
    style.backgroundRepeat = "no-repeat";
    style.backgroundPositionX = "10px";
    style.backgroundPositionY = isFirefox ? "10px" : "0";
    style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}")`;

    console.info("%c Look at you poking around in DevTools.", style.cssText);

    const height2 = 44;
    style.cssText = "";
    style.backgroundColor = backgroundColor;
    style.color = color;
    style.paddingInline = "1em";
    style.paddingBlock = isFirefox ? `${height2 / 2}px` : "0";
    style.lineHeight = `${height2}px`;
    style.fontSize = "1.25em";
    console.info(
        "%c Check out the code, if you want, at https://github.com/muster-mark/mark-fisher-photography",
        style.cssText,
    );
}

if ("requestIdleCallback" in window) {
    requestIdleCallback(consoleSurprise);
} else {
    setTimeout(consoleSurprise, 1000);
}
