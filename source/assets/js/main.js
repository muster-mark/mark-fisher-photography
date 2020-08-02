import Vue from "vue";
import { VueMasonryPlugin } from "vue-masonry";
import explore from "./pages/explore.vue";
import contact from "./pages/contact.vue";

require("vue-multiselect/dist/vue-multiselect.min.css");
require("../css/main.scss");

// Needed for dynamic imports to work, otherwise they will load /public/0.js instead of /assets/0.js for example
// Note dynamic imports currently only used in IE11 (fetch polyfill)
// eslint-disable-next-line camelcase,no-undef
__webpack_public_path__ = "assets/";

if (document.getElementById("explore-app")) {
    Vue.use(VueMasonryPlugin);

    // eslint-disable-next-line no-new
    new Vue({
        el: "#explore-app",
        data: {
            function() {
                return {};
            },
        },
        render: (h) => h(explore),
    });
}

if (document.getElementById("contact-app")) {
    // eslint-disable-next-line no-new
    new Vue({
        el: "#contact-app",
        data: {
            function() {
                return {};
            },
        },
        render: (h) => h(contact),
    });
}
