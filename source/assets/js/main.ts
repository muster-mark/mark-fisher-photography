import {createApp} from "vue";
import {VueMasonryPlugin} from "vue-masonry";
import explore from "./pages/explore.vue";
import contact from "./pages/contact.vue";

require("../css/main.scss");

// Needed for dynamic imports to work, otherwise they will load /public/0.js instead of /assets/0.js for example
// Note dynamic imports currently only used in IE11 (fetch polyfill)
//@ts-ignore
__webpack_public_path__ = "assets/";

if (document.getElementById("explore-app")) {
    createApp(explore)
            .use(VueMasonryPlugin)
            .mount(document.getElementById("explore-app"));
}

if (document.getElementById("contact-app")) {
    createApp(contact).mount(document.getElementById("contact-app"));
}
