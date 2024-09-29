import {createApp} from "vue";

import explore from "./pages/explore.vue";
import contact from "./pages/contact.vue";

require("../css/main.scss");

// Needed for dynamic imports to work (though not currently used), otherwise they will load /public/0.js instead of /assets/0.js for example
//@ts-expect-error
__webpack_public_path__ = "assets/";

if (document.getElementById("explore-app")) {
    createApp(explore)
            .mount(document.getElementById("explore-app"));
}

if (document.getElementById("contact-app")) {
    createApp(contact).mount(document.getElementById("contact-app"));
}
