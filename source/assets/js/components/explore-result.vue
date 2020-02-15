<template><img width="200" :height="Math.round(image.ImageHeight / image.ImageAspectRatio)" :alt="image.Headline" :src="'/photos/w200/' + image.Slug + '@2x.jpg'" /></template>

<script>
    export default {
        props: ['image'],
        data: function() {
            return {

            }
        }

    }
</script>

<style scoped>
    img {
        display: block;
        margin-bottom: 15px; /* same as masonry gutter width */
    }
</style>
