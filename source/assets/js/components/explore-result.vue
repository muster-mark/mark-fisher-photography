<template>
    <a :href="imageUrl" class="explore-result">
        <picture>
            <source type="image/jxl"
                    :srcset="`/photos/w200/${image.Slug}@2x.jxl 2x, /photos/w200/${image.Slug}.jxl 1x`"/>
            <source type="image/webp"
                    :srcset="`/photos/w200/${image.Slug}@2x.webp 2x, /photos/w200/${image.Slug}.webp 1x`"/>
            <img
                    width="200"
                    class="explore-result_img"
                    :height="Math.round(200 / image.ImageAspectRatio)"
                    :alt="image.Headline"
                    :srcset="`/photos/w200/${image.Slug}@2x.jpg 2x, /photos/w200/${image.Slug}.jpg 1x`"
                    :src="`/photos/w200/${image.Slug}.jpg`"
                    :style="{backgroundColor: image.Colors[0]}"
            />
        </picture>
    </a>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue";
import {Image} from "../../../types";

const props = defineProps({
    image: {
        type: Object as PropType<Image>,
    }
});
const imageUrl = computed<string>(() => {
    return `${props.image.Gallery}/${props.image.Slug}`;
});
</script>

<style lang="scss">
.explore-result_img {
    display: block;
}
</style>
