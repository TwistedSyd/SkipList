<template>
    <div id="app">
        <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
        <!-- Header for whole page -->
        <section class="hero is-info">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="fas fa-shipping-fast"></i>
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
                                <button @click="logOut" class="button is-danger"><i class="fas fa-sign-out-alt">&nbsp;</i>Log Out</button>
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
                                        <button @click="showSkipForm = !showSkipForm" class="button is-primary"><i class="fas fa-plus-square">&nbsp;</i>Add Skip</button>
                                    </router-link>
                                </p>
                                <p class="control">
                                    <button @click="showEditForm = !showEditForm" class="button is-info"><i class="fas fa-edit">&nbsp;</i>Edit Skip</button>
                                </p>
                                <p class="control">
                                    <button @click="showComplete = !showComplete" class="button is-success"><i class="fas fa-check-square">&nbsp;</i>Complete Skip</button>
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
                    <div class="field">
                        <div class="control">
                            <div class="select">
                                <select v-model="category">
                                    <option value="empty" selected="true" disabled>Choose Department</option>
                                    <option v-for="category in categories" :value="category.id" :key="category.title">{{category.title}}</option>
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
                    <div class="field is-grouped">
                            <p class="control">
                                <button class="button is-success" @click="getTitle">Add</button>
                            </p>
                            <p class="control">
                                <button class="button is-danger" @click="closeAdd">Cancel</button>
                            </p>
                    </div>
            </div>
        </div>
        <!-- Edit skip form -->
        <div class="modal" :class="{'is-active' : showEditForm }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div v-if="selectedSkip != ''">
                        <div class="field">
                            <div class="control">
                                <div class="select">
                                    <select>>
                                        <option value="empty" selected>{{selectedSkip.dept}}</option>
                                    </select> 
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <div v-if="selectedSkip.reason == 'Material Shortage' || selectedSkip.reason == 'Damaged Material' || selectedSkip.reason == 'Powder Coat'">
                                    <div class="field">
                                        <div class="control">
                                            <div class="select">
                                                <select v-model="editedSkip.reason">
                                                    <option value="" selected disabled>{{selectedSkip.reason}}</option>
                                                    <option v-for="reason in reasons" :key="reason">{{reason}}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="editedSkip.reason == 'Other'">
                                        <div class="field">
                                            <div class="control">
                                                <input type="text" class="input is-info" v-model="otherReason" placeholder="Reason for Skip: Other">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="field">
                                        <div class="control">
                                            <div class="select">
                                                <select v-model="editedSkip.reason">
                                                    <option value="" selected disabled>Other</option>
                                                    <option v-for="reason in reasons" :key="reason">{{reason}}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="editedSkip.reason == 'Other'">
                                        <div class="field">
                                            <div class="control">
                                                <input type="text" class="input is-info" v-model="otherReason" :placeholder="selectedSkip.reason">
                                            </div>
                                        </div>
                                    </div>   
                                </div>
                            </div>
                        </div>
                                             
                        <div class="field">
                            <input type="text" class="input is-primary" v-model="editedSkip.schedule" :placeholder="selectedSkip.schedule">
                        </div>
                        <div class="field">
                            <input type="text" class="input is-primary" v-model="editedSkip.sequence" :placeholder="selectedSkip.sequence">
                        </div>
                        <div class="field">
                            <input type="text" class="input is-primary" v-model="editedSkip.item" :placeholder="selectedSkip.item">
                        </div>
                        <div class="field">
                            <input type="number" class="input is-primary" v-model="editedSkip.units" :placeholder="selectedSkip.units">
                        </div>
                        <div class="field is-grouped">
                            <p class="control">
                                <button class="button is-success" @click="checkEdit">Edit</button>
                            </p>
                            <p class="control">
                                <button class="button is-danger" @click="closeEdit">Cancel</button>
                            </p>
                        </div>
                </div>
                <div v-else>
                    <div class="message is-danger">
                            <div class="message-header">
                                <strong>You need select a skip to edit it.</strong>
                            </div>
                            <div class="message-body has-text-centered">
                                    <button class="button is-info" @click="showEditForm = !showEditForm" >Okay</button>
                            </div>  
                    </div>
                </div>
            </div>
        </div> 
    
        <!-- Complete Skip Form -->
        <div v-if="selectedSkip != ''">
            <div class="modal" :class="{'is-active' : showComplete }">
                <div class="modal-background"></div>
                <div class="modal-content" id="complete-skip">
                    <article class="message is-danger">
                            <div class="message-header">
                                Confirm the following skip is complete:
                            </div>
                            <div class="message-body">
                                <div class="columns">
                                    <div class="column has-border">
                                        <strong> Schedule: </strong> {{ selectedSkip.schedule }} <br>
                                        <strong> Sequence: </strong> {{ selectedSkip.sequence }} 
                                    </div>
                                    <div class="column">
                                        <strong> Item #: </strong> {{ selectedSkip.item }} <br>
                                        <strong> # of Units Affected: </strong> {{ selectedSkip.units }} 
                                    </div>
                                    <div class="column">
                                        <strong> Reason for Skip: </strong> {{ selectedSkip.reason }} <br>
                                        <strong> Dept: </strong> {{ selectedSkip.dept }} 
                                    </div>
                                </div>
                                <div class="field is-grouped">
                                        <p class="control">
                                            <button class="button is-success" @click="getCount">Complete</button>
                                        </p>
                                        <p class="control">
                                            <button class="button is-danger" @click="showComplete = !showComplete">Cancel</button>
                                        </p>
                                </div>
                            </div>
                    </article>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="modal" :class="{'is-active' : showComplete }">
                <div class="modal-background"></div>
                <div class="modal-content">
                    <article class="message is-danger">
                        <div class="message-header">
                            <strong>You need select a skip to complete it.</strong>
                        </div>
                        <div class="message-body has-text-centered">
                                <button class="button is-info" @click="showComplete = !showComplete" >Okay</button>
                        </div>  
                    </article>
                </div>
            </div>
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
            isAuthenticated: false,
            showSkipForm: false,
            showComplete: false,
            showEditForm: false,
            categories: [],
            category: 'empty',

            editedSkip: '',
            selectedSkip: '',
            parent: '',
            schedule: '',
            sequence: '',
            item: '',
            units: null,
            dept: '',
            reasons: ['Material Shortage', 'Damaged Material', 'Powder Coat', 'Other'],
            reason: '',
            otherReason: '',
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
            this.selectedSkip = Object.assign({}, data)
            this.editedSkip = Object.assign({}, data)
            this.selectedSkip.id = data.id

            if(this.editedSkip.reason == 'Material Shortage'||this.editedSkip.reason == 'Damaged Material'||this.editedSkip.reason == 'Powder Coat'){
                this.otherReason = ''
            }else{
                this.otherReason = this.editedSkip.reason
                this.editedSkip.reason = 'Other'
            }

            console.log("Selected: " + this.selectedSkip.id)
        })   
        EventBus.$on('selectNone', () => {
            this.selectedSkip = ''
            this.editedSkip = ''
            this.otherReason = ''
        })
    },
    methods: {
        getTitle() { /* ROUTES TO ADDSKIP() */
            /* Gets the catgeory title (department) of the skip to be added */ 
            if(this.category!=='empty'&&this.reason!==''&&this.schedule!==''&&this.sequence!==''&&this.item!==''&&this.units!==null) {
                if(this.reason == 'Other' && this.otherReason == ''){
                    alert('You must fill out all fields!')
                }else{
                    db.collection('categories').doc(this.category).get().then((documentSnapshot) => {
                                const skipCount = documentSnapshot.data().count
                                const dept = documentSnapshot.data().title
                                this.addSkip(dept, skipCount)

                    })
                }
            }else {
                alert('You must fill out all fields!')
            }
        },
        addSkip(dept, skipCount) {
            /* Adds skip to Firebase/Firestore */
            if(this.reason == 'Other'){
                this.reason = this.otherReason
            }
            const skip = {

                parent: this.category,
                schedule: this.schedule,
                sequence: this.sequence,
                item: this.item,
                units: this.units,
                dept: dept,
                reason: this.reason,
                completed: false,
                added: firebase.firestore.FieldValue.serverTimestamp()
            }
            db.collection('categories').doc(this.category).collection('skips').add(skip)
            db.collection('categories').doc(this.category).update({
                    count: skipCount + 1
            }) 
            /* Make sure to erase form data after skip is added */
            this.schedule = ''
            this.sequence = ''
            this.item = ''
            this.units = null
            this.reason = ''
            this.otherReason = ''
            dept = ''

            this.category = 'empty'
            this.showSkipForm = false
            this.$router.push('/')
        },
        closeAdd() {
            /* Close add skip form and erase data */
            this.showSkipForm = false
            this.schedule = ''
            this.sequence = ''
            this.item = ''
            this.units = null
            this.reason = ''
            this.otherReason = ''
            this.category = 'empty'
        },
        checkEdit() { /* ROUTES TO EDITSKIP */
            if(this.editedSkip.reason!==''&&this.editedSkip.schedule!==''&&this.editedSkip.sequence!==''&&this.editedSkip.item!==''&&this.editedSkip.units!==null) {
                if(this.editedSkip.reason == 'Other' && this.otherReason == ''){
                    alert('You must fill out all fields!')
                }else{
                    this.editSkip()
                }
            }else {
                alert('You must fill out all fields!')
            }
        },
        editSkip() {
            /* TODO: Edit skip data and update in Firebase/Firestore */
            if(this.otherReason != '' && this.editedSkip.reason == 'Other'){
                this.editedSkip.reason = this.otherReason
            }
            db.collection('categories').doc(this.selectedSkip.parent).collection('skips').doc(this.selectedSkip.id).update({
                schedule: this.editedSkip.schedule,
                sequence: this.editedSkip.sequence,
                item: this.editedSkip.item,
                units: this.editedSkip.units,
                reason: this.editedSkip.reason
            })
            console.log("Edited: " + this.selectedSkip.id)
            this.showEditForm = false
            this.editedSkip = ''
            this.selectedSkip = ''
            this.otherReason = ''
            EventBus.$emit('selectNone')
            this.$router.push('/')
        },
        closeEdit() {
            this.showEditForm = false
            this.selectedSkip = ''
            this.editedSkip = ''
            this.otherReason = ''
            EventBus.$emit('selectNone')
           
        },
        getCount() { /* ROUTES TO COMPLETESKIP() */
            this.showComplete = false,
            db.collection('categories').doc(this.selectedSkip.parent).get().then((documentSnapshot) => {
                const skipCount = documentSnapshot.data().count
                this.completeSkip(skipCount)
            })
        },
        completeSkip(skipCount) {
            /* Assigns skip as complete */
            this.selectedSkip.completed = true
            db.collection('categories').doc(this.selectedSkip.parent).collection('skips').doc(this.selectedSkip.id).update({
                completed: true,
                completeDate: firebase.firestore.FieldValue.serverTimestamp()
            })
            db.collection('categories').doc(this.selectedSkip.parent).update({
                    count: skipCount - 1
            }) 
            console.log('Complete: ' + this.selectedSkip.id)
            this.selectedSkip = ''
            this.editedSkip = ''
            this.$router.push('/')
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
