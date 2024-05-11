<template>
    <a :href="imageUrl" class="explore-result">
        <picture>
            <source
                v-for="extension in nonJpgExtensions"
                :key="extension"
                :type="`image/${extension}`"
                :srcset="getSrcSet(image.Slug, extension, imageWidth)"/>
            <img
                    class="explore-result_img"
                    :width="imageWidth"
                    :height="Math.round(imageWidth / image.ImageAspectRatio)"
                    :alt="image.Headline"
                    :srcset="getSrcSet(image.Slug, 'jpg', imageWidth)"
                    :src="getSrc(image.Slug, 'jpg', imageWidth)"
                    :style="{backgroundColor: image.Colors[0]}"
            />
        </picture>
    </a>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import type {Image} from "../../../types";

const props = defineProps<{ image: Image }>();

const imageUrl = computed<string>(() => {
    return `${props.image.Gallery}/${props.image.Slug}`;
});

const imageWidth = 200;

const xDescriptorsToSuffixes = {
    '1x': '',
    '2x': '@2x'
};
const nonJpgExtensions = ["jxl", "webp"];

function getSrc(slug: string, extension: string, width: number, suffix="") {
    return `/photos/w${width}/${slug}${suffix}.${extension}`;
}

function getSrcSet(slug: string, extension: string, width: number) {
    return Object.entries(xDescriptorsToSuffixes).map(entry => {
        const xDescriptor = entry[0];
        const suffix = entry[1];
        return `${getSrc(slug, extension, width, suffix)} ${xDescriptor}`
    }).join(", ");
}
</script>

<style lang="scss">
.explore-result_img {
    display: block;
}
</style>
