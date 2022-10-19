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
                    <input
                            type="checkbox"
                            :value="seasonCount.name"
                            v-model="selectedSeasons"
                            :id="`season-checkbox_${seasonCount.name}`"
                            class="explore-filter-checkbox"
                    />
                    <label
                            class="explore-filter-label"
                            :for="`season-checkbox_${seasonCount.name}`"
                    >
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
                            class="explore-filter-checkbox"
                    />
                    <label
                            :for="`country-checkbox_${countryCount.name}`"
                            class="explore-filter-label"
                    >
                        {{ countryCount.name.replace(" ", " ") }}&nbsp;({{ countryCount.count }})
                    </label>
                </span>
            </div>
        </details>

        <div ref="scrollTarget" class="explore_result-summary">
            <span v-if="!filteredImages.length">No images match your search criteria</span>
            <span class="smaller" v-else>Showing <span class="larger">{{ firstShown }}-{{ lastShown }}</span> of <span
                    class="larger">{{ filteredImages.length }}</span> matching images</span>
        </div>

        <div ref="masonryLayoutContainer">
            <masonry-layout
                    ref="masonryElement"
                    class="explore-results"
                    :cols="numColumns"
                    :gap="masonryGap"
                    :maxcolwidth="columnWidth"
                    :style="`width: ${masonryWidth}px`"
            >
                <div
                        class="explore_result"
                        v-for="image in filteredImages.slice(firstShown - 1, lastShown)"
                        :key="image.Slug"
                >
                    <explore-result :image="image"></explore-result>
                </div>
            </masonry-layout>
        </div>

        <PaginationLinks
                :page="page"
                @page-change="goToPage($event)"
                :numPages="numPages"
                aria-controls=""
        ></PaginationLinks>
    </div>
</template>

<script lang="ts">
import "@appnest/masonry-layout";
</script>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import ExploreResult from "../components/explore-result.vue";
import PaginationLinks from "../components/pagination-links.vue";
import SvgIcon from "../components/svg-icon.vue";
import {
    Image,
    CountryCount,
    SeasonCount,
    Season,
} from "../../../types";

const seasonCounts = ref<SeasonCount[]>([]);
const selectedSeasons = ref<Season[]>([Season.spring, Season.summer, Season.autumn, Season.winter]);
const countryCounts = ref<CountryCount[]>([]);
const selectedCountries = ref<string[]>([]);
const allImages = ref<Image[]>([]);
const resultLimit = 15;
const page = ref(1);
const numColumns = ref(4);
const masonryGap = ref(15);
const columnWidth = 200;
const scrollTarget = ref<HTMLElement>(null);
const masonryLayoutContainer = ref<HTMLElement>(null);
const masonryElement = ref<HTMLElement>(null);

const filteredImages = computed(() => {
    return allImages.value.filter(image => matchesCountry(image) && matchesSeason(image));
});

const firstShown = computed(() => {
    return resultLimit * (page.value - 1) + 1;
});

const lastShown = computed(() => {
    return Math.min(filteredImages.value.length, resultLimit * (page.value));
});

const numPages = computed(() => {
    return Math.ceil(filteredImages.value.length / resultLimit);
});

const masonryWidth = computed(() => {
    return numColumns.value * (columnWidth + masonryGap.value) - masonryGap.value;
});

function matchesCountry(image: Image) {
    return selectedCountries.value.find((country) => country === image.CountryPrimaryLocationName);
}

function matchesSeason(image: Image) {
    return selectedSeasons.value.find((season) => season === image.Season);
}

watch(selectedCountries, () => {
    page.value = 1;
});

watch(selectedSeasons, () => {
    page.value = 1;
});

function goToPage(pageNumber: number) {
    page.value = pageNumber;
    window.scrollTo(0, scrollTarget.value.offsetTop);
}

function updateColumns() {
    numColumns.value = Math.floor((masonryLayoutContainer.value.clientWidth + masonryGap.value) / (columnWidth + masonryGap.value));
    masonryElement.value.setAttribute("gap", `${masonryGap.value}`); // Seems to be bug in @appnest component
}

fetch("/data/images.json")
        .then(data => data.json())
        .then(json => {
            allImages.value = json.images;
            countryCounts.value = json.countryCounts;
            selectedCountries.value = json.countryCounts.map((countryCount: CountryCount) => countryCount.name);
            selectedCountries.value = Array.from(new Set(selectedCountries.value));
            seasonCounts.value = json.seasonCounts;
        })
        .catch(err => {
            console.error("There was an error fetching data");
            console.log(err);
        });

onMounted(() => {
    masonryElement.value.setAttribute("gap", `${masonryGap.value}`); // Seems to be bug in @appnest component
    if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(() => {
            updateColumns();
        });
        resizeObserver.observe(masonryLayoutContainer.value);
    } else {
        // Fallback for Safari < 13.1
        (["resize", "orientationchange"] as const).forEach(event => {
            window.addEventListener(event, updateColumns, {passive: true})
        });
    }
});

onUnmounted(() => {
    (["resize", "orientationchange"] as const).forEach(event => {
        window.removeEventListener(event, updateColumns);
    });
});
</script>

<style lang="scss">

// Scoped styles not working here because of https://github.com/vuejs/vue-loader/issues/1915

.explore-results {
    margin: auto;
    padding: 0;
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

.explore-filter-checkbox {
    display: none;
}

.explore-filter-label::before {
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

.explore-filter-checkbox:checked + label::before {
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


.explore-filter-label {
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
