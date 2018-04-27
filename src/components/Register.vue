<template>
    <div class="register">
        <form @submit.prevent="register">
            <label for="email">Email</label>
            <input type="email" v-model="user.email">
            <label for="password">Password</label>
            <input type="password" v-model="user.password">
            <button type="submit">Register</button>
        </form>
        <p>already a user?<em @click="login()">Login</em></p>
    </div>
</template>

<script>
export default {
    name: "register",
    data() {
        return {
            user: {}
        }
    },
    methods: {
        register(){
            this.$store.dispatch('register', this.user)
        },
        login() {
            this.$router.push("login")
        }
    }

}
</script>

<style>

</style>