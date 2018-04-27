<template>
    <div class="login">
        <form @submit.prevent="login">
            <label for="email">Email</label>
            <input type="email" v-model="user.email">
            <label for="passowrd">Password</label>
            <input type="password" v-model="user.password">
            <button type="submit">login</button>
        </form>
        <p>Not a User?<em @click="register()">Register</em></p>
    </div>
</template>

<script>
export default {
    name: "login",
    data() {
        return {
            user: {}
        }
    },
    methods: {
        login(){
            this.$store.dispatch('login', this.user)
        },
        register() {
            this.$router.push("register")
        }
    }

}
</script>

<style>

</style>