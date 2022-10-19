<template>
    <div class="pagination-links">
        <button
                class="pagination_previous pagination-links_button"
                @click="$emit('page-change', page - 1)" :disabled="page === 1"
        >
            <SvgIcon name="chevron-left" title="Previous page"></SvgIcon>
        </button>

        <ol class="pagination-links_list">
            <li
                    v-for="index in numPages"
                    :key="index">
                <button
                        @click="$emit('page-change', index)"
                        :disabled="page === index"
                        class="pagination-links_button"
                        :class="{'current': page === index}"
                >
                    {{ index }}
                </button>
            </li>
        </ol>

        <button
                class="pagination_next pagination-links_button"
                @click="$emit('page-change', page + 1)"
                :disabled="page === numPages">
            <SvgIcon name="chevron-right" title="Next page"></SvgIcon>
        </button>
    </div>

</template>

<script lang="ts" setup>
import {defineEmits, defineProps} from "vue";

import SvgIcon from "./svg-icon.vue";

defineProps({
    numPages: {
        type: Number,
    },
    page: {
        type: Number,
    }
});
defineEmits(['page-change']);
</script>

<style lang="scss">
.pagination-links {
    margin: 30px auto;
    display: table;
    font-size: 1.5em;

    &_list {
        list-style-type: none;
        display: inline;
        padding: 0;

        li {
            display: inline;
            padding: 0.3em;
        }

        button {
            transition: transform 0.2s;
        }

        &:hover button, &:focus-within button {
            transform: scale(1);
        }

        &:hover button:hover, &:focus-within button:focus {
            transform: scale(1.25);
        }
    }

    &_button {
        background-color: transparent;
        border: none;
        color: #f9ebd2;
        font-size: inherit;

        &:focus, &:not(:disabled):hover {
            color: #efa929;
            cursor: pointer;
        }

        &.current {
            color: #efa929;
            transform: scale(1.25);
        }

        .ico {
            position: relative;
            top: 0.16em;
        }
    }
}

.pagination_previous, .pagination_next {
    &:disabled {
        color: #666; //TODO WHAT GREY?
    }
}
</style>
