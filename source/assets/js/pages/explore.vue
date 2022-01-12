<template>
    <div>
        <details class="explore-filter">
            <summary>
                <svg-icon name="filter"></svg-icon>
                <span class="explore-filter_details-closed">Show filters</span>
                <span class="explore-filter_details-open">Hide filters</span></summary>
            <div class="explore-filter_title">Seasons:</div>
            <div class="checkbox-grid">
                <span v-for="seasonCount in seasonCounts" :key="`season-checkbox_${seasonCount.name}`">
                    <input type="checkbox"
                           :value="seasonCount.name"
                           v-model="selectedSeasons"
                           :id="`season-checkbox_${seasonCount.name}`"
                    />
                    <label :for="`season-checkbox_${seasonCount.name}`">
                        {{ seasonCount.name[0].toUpperCase() + seasonCount.name.substr(1) }}&nbsp;({{
                            seasonCount.count
                        }})
                    </label>
                </span>
            </div>

            <div class="explore-filter_title">Countries:</div>
            <div class="checkbox-grid">
                <span v-for="countryCount in countryCounts" :key="`country-checkbox_${countryCount.name}`">
                    <input
                            type="checkbox"
                            :value="countryCount.name"
                            v-model="selectedCountries"
                            :id="`country-checkbox_${countryCount.name}`"
                    />
                    <label :for="`country-checkbox_${countryCount.name}`">
                        {{ countryCount.name.replace(" ", " ") }}&nbsp;({{ countryCount.count }})
                    </label>
                </span>
            </div>
        </details>


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
                :key="image.Slug"
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

<script lang="ts">

import ExploreResult from "../components/explore-result.vue";
import PaginationLinks from "../components/pagination-links.vue";
import SvgIcon from "../components/svg-icon.vue";
import {
    Image,
    CountryCount,
    SeasonCount,
    Season,
} from "../../../types";

export default {
    components: {
        PaginationLinks,
        ExploreResult,
        SvgIcon
    },
    data() {
        return {
            seasonCounts: [] as SeasonCount[],
            selectedSeasons: [Season.spring, Season.summer, Season.autumn, Season.winter] as Season[],
            countryCounts: [] as CountryCount[],
            selectedCountries: [] as string[],
            allImages: [] as Image[],
            resultLimit: 15, // rename perPage
            page: 1,
            scrollTarget: null as HTMLElement, // Element to scroll to after changing page
        };
    },
    computed: {
        filteredImages(): Image[] {
            return this.allImages.filter((image: Image) => this.matchesCountry(image) && this.matchesSeason(image));
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
        matchesCountry(image: Image) {
            return this.selectedCountries.find((country: string) => country === image.CountryPrimaryLocationName);
        },
        matchesSeason(image: Image) {
            return this.selectedSeasons.find((season: Season) => season === image.Season);
        },
        seasonLabel({name, count}: SeasonCount) {
            return `${name} (${count})`;
        },
        goToPage(page: number) {
            this.page = page;
            window.scrollTo(0, this.scrollTarget.offsetTop);
        },
    },
    watch: {
        selectedCountries() {
            this.page = 1;
        },
        selectedSeasons() {
            this.page = 1;
        },
    },
    created() {
        fetch("/data/images.json")
                .then(data => data.json())
                .then(json => {
                    this.allImages = json.images;
                    this.countryCounts = json.countryCounts;
                    const selectedCountries = json.countryCounts.map((countryCount: CountryCount) => countryCount.name);
                    this.selectedCountries = Array.from(new Set(selectedCountries));
                    this.seasonCounts = json.seasonCounts;
                })
                .catch((err) => {
                    console.error("There was an error fetching data");
                    console.log(err);
                });
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

.explore-filter {
    &[open] {
        .explore-filter_details-closed {
            display: none;
        }
    }

    &:not([open]) {
        .explore-filter_details-open {
            display: none;
        }
    }

    summary .ico {
        vertical-align: -.1em;
    }

    &_title {
        margin-bottom: 0.5em;
    }
}

.checkbox-grid {
    margin-bottom: 1em;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(max-content, 200px));
    gap: 8px 16px;
}

$checkbox-size: 20px;

input[type="checkbox"] {
    display: none;
}

label::before {
    grid-row: 1;
    grid-column: 1;
    display: inline-block;
    content: "";
    width: $checkbox-size;
    height: $checkbox-size;
    background-color: orange;
    margin-right: 1em;
    transition: clip-path 0.25s;
    clip-path: polygon(
                    0% 0%,
                    100% 0%,
                    100% 100%,
                    0% 100%,
                    0% 52.3%,
                    10% 10%,
                    10% 90%,
                    90% 90%,
                    90% 10%,
                    41% 10%,
                    10% 10%,
                    10% 52.3%,
                    0% 52.3%,
                    0% 0%);
}

input[type="checkbox"]:checked + label::before {
    clip-path: polygon(
                    0% 0%,
                    100% 0%,
                    100% 100%,
                    0% 100%,
                    0% 52.3%,
                    14.1% 52.3%,
                    41% 79.7%,
                    86.6% 33.5%,
                    76.3% 25.6%,
                    41% 60.5%,
                    23.2% 43.2%,
                    14.1% 52.3%,
                    0% 52.3%,
                    0% 0%);
}


label {
    display: inline-grid;
    gap: 1em;
    grid-template-columns: $checkbox-size 1fr;
    align-items: center;
    color: white;
    white-space: nowrap;

    &::after {
        /* Needed as as a click target; */
        grid-column: 1;
        grid-row: 1;
        content: "";
        width: $checkbox-size;
        height: $checkbox-size;
    }
}

</style>
