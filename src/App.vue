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
                                <router-link to="/" class="navbar-item button is-success">Login Page</router-link>
                            </p>
                        </div>
                        <div class="field" v-else>
                            <div class="field is-grouped">
                                <p class="control">
                                    <button @click="showSkipForm = !showSkipForm" class="button is-primary">Add Skip</button>
                                </p>
                                <p class="control">
                                    <button @click="logOut" class="button is-danger">Log Out</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="modal" :class="{'is-active' : showSkipForm }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <form @submit.prevent="addSkip">
                    <div class="field">
                        <select v-model="category">
                            <option value="empty" selected>Choose Department</option>
                            <option v-for="category in categories" :value="category.id" :key="category.title">{{ category.title}}</option>
                        </select>
                    </div>
                    <div class="field">
                        <input type="text" class="input" v-model="title" placeholder="Title">
                    </div>
                    <div class="field">
                        <input type="text" class="input" v-model="item" placeholder="Item #">
                    </div>

                    <div class="field">
                        <button class="button is-success">Add</button>
                    </div>

                </form>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="showSkipForm = !showSkipForm"></button>
        </div>
        <router-view/>
    </div>
</template>


<script>
import firebase from 'firebase'
import { db } from './main'

export default {
    data() {
        return {
            categories: [],
            category: 'empty',
            isAuthenticated: false,
            showSkipForm: false,
            title: '',
            item: ''
        }
    },
    firestore() {
        return {
            categories: db.collection('categories').orderBy('flow')
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
        addSkip() {
            if(this.title && this.category !== 'empty') {
                const skip = {
                    title: this.title,
                    item: this.item
                }
                db.collection('categories').doc(this.category).collection('skips').add(skip)
                this.title = ''
                this.item = ''
                this.category = 'empty'
                this.showSkipForm = false

            }else{
                alert('You must fill out all fields!')
            }
    
        },
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

<!-- CSS style from Bulma: https://bulma.io/extensions/ --> 
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
