<template>
    <div class="lost">
        <h1>You are lost</h1>
        <button @click="goBack()"></button>
    </div>
</template>

<script>
    export default {
        name: "lost",
        data() {
            return {
                user: {}
            }
        },
        methods: {
            goBack() {
                this.$router.push('/')
            }
        }
    }
</script>

<style>
</style>