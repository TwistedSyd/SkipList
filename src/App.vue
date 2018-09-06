<template>
    <div id="app">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="/">
                    Skip List | Jeld-Wen
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div class="navbar-menu">
                <div class="navbar-start">
                    <router-link to="/about" class="navbar-item">About</router-link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field is-grouped" v-if="!isAuthenticated">
                            <p class="control">
                                <router-link to="/login" class="navbar-item button is-info">Login</router-link>
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

                    this.$router.push('/login')
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
