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
                        <div class="field is-grouped" v-if="isAuthenticated">
                            <p class="control">
                                <button @click="logOut" class="button is-danger">Log Out</button>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field is-grouped" v-if="!isAuthenticated">
                            <!--<p class="control">
                                <router-link to="/" class="navbar-item button is-success">Login Page</router-link>
                            </p>-->
                        </div>
                        <div class="field" v-else>
                            <div class="field is-grouped">
                                <p class="control">
                                    <button @click="showSkipForm = !showSkipForm" class="button is-primary">Add Skip</button>
                                </p>
                                <p class="control">
                                    <button @click="editSkip" class="button is-info">Edit Skip</button>
                                </p>
                                <p class="control">
                                    <button @click="completeSkip" class="button is-success">Complete Skip</button>
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
                <form @submit.prevent="getTitle" >

                    <div class="field">
                        <div class="control">
                            <div class="select">
                                <select v-model="category">
                                    <option value="empty" selected="true" disabled>Choose Department</option>
                                    <option v-for="category in categories" :value="category.id" :key="category.title">{{ category.title}}</option>
                                </select> 
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <div class="select">
                                <select v-model="reason">
                                    <option value="" selected disabled>Reason for Skip</option>
                                    <option v-for="reason in reasons" :value="reason" :key="reason">{{ reason }}</option>
                                </select> 
                            </div>
                        </div>
                    </div>
                        <div class="field" v-if="reason == 'Other'">
                            <input type="text" class="input is-info" v-model="otherReason" placeholder="Reason for Skip: Other">
                        </div>

                    <div class="field">
                        <input type="text" class="input is-primary" v-model="schedule" placeholder="Schedule #">
                    </div>
                    <div class="field">
                        <input type="text" class="input is-primary" v-model="sequence" placeholder="Sequence #">
                    </div>
                    <div class="field">
                        <input type="text" class="input is-primary" v-model="item" placeholder="Item #">
                    </div>
                    <div class="field">
                        <input type="number" class="input is-primary" v-model="units" placeholder="# of Units Affected">
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
import EventBus from './event-bus'

export default {
    data() {
        return {
            reasons: ['Material Shortage', 'Damaged Material', 'Powder Coat', 'Other'],
            reason: '',
            otherReason: '',
            categories: [],
            category: 'empty',
            isAuthenticated: false,
            showSkipForm: false,

            schedule: '',
            sequence: '',
            item: '',
            units: null,
            dept: ''
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
        getTitle() {  
            db.collection('categories').doc(this.category).get().then((documentSnapshot) => {
                        const dept = documentSnapshot.data().title
                        this.addSkip(dept)
            })
        },
        addSkip(dept) {
            if(this.category !== 'empty') {
                if(this.reason == 'Other'){
                    this.reason = 'Other: ' + this.otherReason
                }
                const skip = {
                    reason: this.reason,
                    schedule: this.schedule,
                    sequence: this.sequence,
                    item: this.item,
                    units: this.units,
                    dept: dept
                }
                db.collection('categories').doc(this.category).collection('skips').add(skip)
                this.reason = ''
                this.schedule = ''
                this.sequence = ''
                this.item = ''
                this.units = null
                dept = ''
                this.category = 'empty'
                this.showSkipForm = false
                this.$router.push('/')
            }else{
                alert('You must fill out all fields!')
            }
    
        },
        editSkip() {
            console.log('Edit')
        },
        completeSkip() {
            console.log('Complete')
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
