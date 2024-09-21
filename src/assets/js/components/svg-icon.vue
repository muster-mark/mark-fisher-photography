<template>
    <svg role="img" class="ico" :viewBox="`0 0 ${width} ${height}`" :title="title">
        <use :xlink:href="`/images/icons_sprite.svg#${name}`"></use>
    </svg>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const defaultWidth = 448;
const defaultHeight = 512;

/**
 * Any icons not defined here have default width and height
 */
const iconDimensions: Record<string, { width: number; height?: number }> = {
    "chevron-left": {
        width: 256,
    },
    "chevron-right": {
        width: 256,
    },
    "map-marked-alt": {
        width: 576,
    },
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
        width: 448,
    },
};

const { name, title } = defineProps<{
    name: string;
    title?: string;
}>();

const width = computed(() => (iconDimensions[name] ? (iconDimensions[name].width ?? defaultWidth) : null));
const height = computed(() => (iconDimensions[name] ? (iconDimensions[name].height ?? defaultHeight) : null));
</script>
