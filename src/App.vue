<template>
    <div id="app">
        <section class="hero is-info is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Skip List | Jeld-Wen Bend Division
                    </h1>
                </div>
            </div>
        </section>
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div class="navbar-menu">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <div class="field is-grouped">
                            <p class="control">
                                <router-link to="/dashboard" class="navbar-item button is-link">Production Skips</router-link>
                            </p>
                            <p class="control">
                                <router-link to="/about" class="navbar-item button is-info">About</router-link>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field is-grouped" v-if="!isAuthenticated">
                            <p class="control">
                                <router-link to="/" class="navbar-item button is-success">Login</router-link>
                            </p>
                        </div>
                        <div class="field" v-else>
                            <p class="control">
                                <button @click="logOut" class="button is-danger">Log Out</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
        <router-view/>
    </div>
</template>
<script>
import firebase from 'firebase'
export default {
    data () {
        return {
            isAuthenticated: false
        }
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.isAuthenticated = true
            }
        })
    },
    methods: {
        logOut() {
            firebase.auth().signOut()
                .then(() => {
                    this.isAuthenticated = false

                    this.$router.push('/')
                })
        }
    }
}
</script>

<style>
@import "../node_modules/bulma/css/bulma.css";
#app {
font-family: 'Avenir', Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
}
#nav {
padding: 30px;
}

#nav a {
font-weight: bold;
color: #2c3e50;
}

#nav a.router-link-exact-active {
color: #42b983;
}
</style>
