require('vue-multiselect/dist/vue-multiselect.min.css');
require('../css/main.scss');

__webpack_public_path__ = "assets/"; //Needed for dynamic imports to work, otherwise they will load /public/0.js instead of /assets/0.js for example

import Vue from 'vue';
import explore from "./pages/explore";
import {VueMasonryPlugin} from "vue-masonry";

if (document.getElementById('explore-app')) {

    Vue.use(VueMasonryPlugin);
    new Vue({
        el: '#explore-app',
        data: {
            function() {
                return {}
            }
        },
        render: h => h(explore)
    });
} else {
    console.log('no element');
}




