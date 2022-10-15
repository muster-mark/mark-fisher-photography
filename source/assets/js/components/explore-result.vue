<template>
    <a :href="imageUrl">
        <picture>
            <source type="image/jxl" :srcset="`/photos/w200/${image.Slug}@2x.jxl 2x, /photos/w200/${image.Slug}.jxl 1x`" />
            <source type="image/webp" :srcset="`/photos/w200/${image.Slug}@2x.webp 2x, /photos/w200/${image.Slug}.webp 1x`" />
            <img width="200" :height="Math.round(200 / image.ImageAspectRatio)" :alt="image.Headline"
                 :srcset="`/photos/w200/${image.Slug}@2x.jpg 2x, /photos/w200/${image.Slug}.jpg 1x`"
                 :src="'/photos/w200/' + image.Slug + '.jpg'"
                 :style="{backgroundColor: image.Colors[0]}"
            />
        </picture>
    </a>
</template>

<script lang="ts">
    export default {
        props: ["image"],
        data() {
            return {};
        },
        computed: {
            imageUrl() {
                return `${this.image.Gallery}/${this.image.Slug}`;
            },
        },
    };
</script>

<style lang="scss" scoped>
    img {
        display: block;
        //margin-bottom: 15px; /* same as masonry gutter width */
    }
</style>
