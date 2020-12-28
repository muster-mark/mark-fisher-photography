<template>
    <div>

        <div class="multiselect__label">Countries:</div> <!-- TODO declare this describes the select -->
        <multi-select
                v-model="selectedCountries"
                :options="countries"
                :multiple="true"
                track-by="name"
                :custom-label="countryLabel"
                placeholder="Select one or more countries"
                :allow-empty="false"
        >
        </multi-select>

        <div class=".multiselect__label">Seasons</div>
        <multi-select
                v-model="selectedSeasons"
                :options="seasons"
                :multiple="true"
                :searchable="false"
                :close-on-select="true"
                track-by="name"
                :custom-label="seasonLabel"
                placeholder="Select one or more seasons"
                :allow-empty="false"
        ></multi-select>

        <div class="explore_result-summary js_scroll-target">
            <span v-if="!filteredImages.length">No images match your search criteria</span>
            <span class="smaller" v-else>Showing <span class="larger">{{ firstShown }}-{{ lastShown }}</span> of <span
                    class="larger">{{ filteredImages.length }}</span> matching images</span>
        </div>


        <ul v-masonry
            transition-duration="0s"
            item-selector=".explore_result"
            column-width="200"
            gutter="15"
            fit-width="true"

        >
            <li v-masonry-tile
                class="explore_result"
                v-for="image in filteredImages.slice(firstShown - 1, lastShown)"
                :key="image.FileName"
            >
                <explore-result :image="image"></explore-result>
            </li>
        </ul>

        <pagination-links :page="page" v-on:page-change="goToPage($event)"
                          :numPages="numPages"
                          aria-controls=""
        ></pagination-links>

    </div>

</template>

<script lang="js">
import MultiSelect from "vue-multiselect";

import ExploreResult from "../components/explore-result.vue";
import PaginationLinks from "../components/pagination-links.vue";

export default {
    data() {
        return {
            seasons: [],
            selectedSeasons: [],
            countries: [],
            selectedCountries: [],
            allImages: [],
            resultLimit: 15, // rename perPage
            page: 1,
            scrollTarget: null, // Element to scroll to after changing page
        };
    },
    computed: {
        filteredImages() {
            return this.allImages.filter((image) => this.matchesCountry(image) && this.matchesSeason(image));
        },
        firstShown() {
            return this.resultLimit * (this.page - 1) + 1;
        },
        lastShown() {
            return Math.min(this.filteredImages.length, this.resultLimit * (this.page));
        },
        numPages() {
            return Math.ceil(this.filteredImages.length / this.resultLimit);
        },
    },
    methods: {
        matchesCountry(image) {
            return this.selectedCountries.find((obj) => obj.name === image.CountryPrimaryLocationName);
        },
        matchesSeason(image) {
            return this.selectedSeasons.find((obj) => obj.name === image.Season);
        },
        seasonLabel({ name, count }) {
            return `${name} (${count})`;
        },
        countryLabel({ name, count }) {
            return `${name} (${count})`;
        },
        goToPage(page) {
            this.page = page;
            window.scrollTo(0, this.scrollTarget.offsetTop);
        },
        onCreate() {
            const self = this;
            fetch("/data/images.json")
                    .then(data => data.json())
                    .then(json => {
                        self.allImages = json.images;
                        self.countries = json.countryCounts;
                        self.selectedCountries = json.countryCounts;
                        self.seasons = json.seasonCounts;
                        self.selectedSeasons = json.seasonCounts;
                    })
                    .catch((err) => {
                        console.error("There was an error fetching data");
                        console.log(err);
                    });
        }
    },
    watch: {
        selectedCountries() {
            this.page = 1;
        },
        selectedSeasons() {
            this.page = 1;
        },
    },
    components: {
        PaginationLinks,
        MultiSelect,
        ExploreResult,
    },
    created() {
        const self = this;

        if (typeof window.fetch === "undefined") {
            import("whatwg-fetch")
                    .then(() => {
                        self.onCreate();
                    });
        } else {
            this.onCreate();
        }

    },
    mounted() {
        this.scrollTarget = document.querySelector(".js_scroll-target");
    },
};
</script>

<style lang="scss" scoped>

ul {
    list-style-type: none;
    margin: auto;
    padding: 0;

    @media screen and (max-width: 240px) {
        // 1 col
        width: 200px;
    }

    @media screen and (max-width: 405px) {
        // 2 cols
        width: 415px;
    }

    @media screen and (max-width: 670px) {
        // 3 cols
        width: 630px;
    }

    @media screen and (max-width: 885px) {
        //4 cols
        width: 845px;
    }

}

.explore_result-summary {
    text-align: center;
    margin: 20px 0;

    .larger {
        color: #efa929;
    }
}

@keyframes fadeAndGrowIn {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }

    50% {
        opacity: 0.5;
        transform: scale(1);
    }

    100% {
        opacity: 1;
    }
}

.explore_result {
    animation-name: fadeAndGrowIn;
    animation-iteration-count: 1;
    animation-duration: 0.6s;
}

</style>
