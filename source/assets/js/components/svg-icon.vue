<template>
    <svg role="img" class="ico" :viewBox="`0 0 ${width} ${height}`" :title="title">
        <use :xlink:href="`/images/icons_sprite.svg#${name}`"></use>
    </svg>
</template>

<script>

    const defaultWidth = 448;
    const defaultHeight = 512;

    // Commented icons are default width and default height

    const iconDimensions = {
        // instagram: {
        // },
        "chevron-left": {
            width: 256,
        },
        "chevron-right": {
            width: 256,
        },
        "map-marked-alt": {
            width: 576,
        },
        // 'calendar-alt': {
        // },
        "camera-retro": {
            width: 512,
        },
        envelope: {
            width: 512,
        },
        "exclamation-circle": {
            width: 512,
        },
        "film-canister": {
            width: 576,
        },
        telescope: {
            width: 640,
        },
        filter: {
            width: 512,
        },
        hashtag: {
            width: 448
        }
    };
    export default {
        props: ["name", "title"],
        data() {
            return {
                width: iconDimensions[this.name] ? iconDimensions[this.name].width || defaultWidth : null,
                height: iconDimensions[this.name] ? iconDimensions[this.name].height || defaultHeight : null,
            };
        },
    };
</script>
