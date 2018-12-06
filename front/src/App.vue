<template>
    <div class="app">
        <router-view />
    </div>
</template>


<script>
    export default {name: 'App'};
</script>
<style lang='less'>
* {
    &::-webkit-scrollbar {
        width: 8px;
        height: 6px;
        background-color: #fff;
    }
    &::-webkit-scrollbar-button {
        display: none;
        //background-color: red !important;
    }
    &::-webkit-scrollbar-track {
        display: none;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #dddddd;
    }
}
</style>
