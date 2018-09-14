<template>
    <div id="app">
        <!-- Header for whole page -->
        <section class="hero is-info is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Skip List | Jeld-Wen Bend Division
                    </h1>
                </div>
            </div>
        </section>

        <!-- Navigation bar, for buttons such as: Login, Log Out, Add Skip, etc -->
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
                        </div>
                        <div class="field" v-else>
                            <div class="field is-grouped">
                                <p class="control">
                                    <router-link to="/">
                                        <button @click="showSkipForm = !showSkipForm" class="button is-primary">Add Skip</button>
                                    </router-link>
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

        <!-- Add skip form -->
        <div class="modal" :class="{'is-active' : showSkipForm }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <form @submit.prevent="getTitle">
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
    <!-- Edit skip form -->
    <div class="modal" :class="{'is-active' : showSkipForm }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <form @submit.prevent="getTitle">
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
            parent: '',
            selectedSkip: '',
            isAuthenticated: false,
            showSkipForm: false,

            schedule: '',
            sequence: '',
            item: '',
            units: null,
            dept: '',
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
    mounted() {
        /* Catches or sends data via the Event Bus */
        EventBus.$on('Select', data => {
            this.selectedSkip = data
        })   
    },
    methods: {
        getTitle() { 
            /* Gets the catgeory title (department) of the skip to be added */ 
            db.collection('categories').doc(this.category).get().then((documentSnapshot) => {
                        const dept = documentSnapshot.data().title
                        this.addSkip(dept)
            })
        },
        addSkip(dept) {
            /* Adds skip to Firebase/Firestore */
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
                    dept: dept,
                    completed: false,
                    parent: this.category
                }
                db.collection('categories').doc(this.category).collection('skips').add(skip)
                /* Make sure to erase form data after skip is added */
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
            /* TODO: Edit skip data and update in Firebase/Firestore */
            console.log('Edit')
        },
        completeSkip() {
            /* Assigns skip as complete */
            if(this.selectedSkip != ''){
                this.selectedSkip.completed = true
                db.collection('categories').doc(this.selectedSkip.parent).collection('skips').doc(this.selectedSkip.id).update({
                    completed: true
                })
                this.$router.push('/')
            }else{
                alert("You must select a skip to complete it!")
            }
        },
        logOut() {
            /* Log user out */
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
<style lang="scss">
@import "./assets/main.scss";
</style>
