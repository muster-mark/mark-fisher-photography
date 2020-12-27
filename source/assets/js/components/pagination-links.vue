<template>
    <div class="pagination">
        <button class="pagination_previous" @click="$emit('page-change', page - 1)" :disabled="page === 1">
            <svg-icon name="chevron-left" title="Previous page"></svg-icon>
        </button>

        <ol>
            <li v-for="index in numPages" :key="index">
                <button @click="$emit('page-change', index)" :disabled="page === index"
                        :class="{current: page === index}">
                    {{ index }}
                </button>
            </li>
        </ol>

        <button class="pagination_next" @click="$emit('page-change', page + 1)" :disabled="page === numPages">
            <svg-icon name="chevron-right" title="Next page"></svg-icon>

        </button>
    </div>

</template>

<script>

    import SvgIcon from "./svg-icon.vue";

    export default {
        props: ["numPages", "page"],
        data() {
            return {};
        },
        components: {
            SvgIcon,
        },
    };

</script>

<style lang="scss" scoped>
    ol {
        list-style-type: none;
        display: inline;
        padding: 0;
    }

    .pagination {
        margin: 30px auto;
        display: table;
        font-size: 1.5em;
    }

    button {
        background-color: transparent;
        border: none;
        color: #f9ebd2;
        font-size: inherit;

        &:focus, &:not(:disabled):hover {
            color: #efa929;
            cursor: pointer;
        }
    }

    li {
        display: inline;
        padding: 0.3em;
    }

    ol button {
        transition: transform 0.2s;
    }

    ol:hover button, ol:focus-within button {
        transform: scale(1);
    }

    ol:hover button:hover, ol:focus-within button:focus {
        transform: scale(1.25);
    }

    .current {
        color: #efa929;
        transform: scale(1.25);
    }

    .ico {
        position: relative;
        top: 0.16em;
    }

    .pagination_previous, .pagination_next {
        &:disabled {
            color: #666; //TODO WHAT GREY?
        }
    }

</style>
