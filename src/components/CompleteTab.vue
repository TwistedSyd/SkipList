<template>
    <div>
        <!-- Card component, each skip is listed in its own card, 
             all skip informatin is listed here -->
        <div class="card" v-for="skip in skips" :key="skip.id" v-if="skip.completed == true">
            <div class="card-content">        
                <div class="columns">
                    <div class="column">
                        <strong> Schedule: </strong> {{ skip.schedule }} <br>
                        <strong> Sequence: </strong> {{ skip.sequence }} 
                    </div>
                    <div class="column">
                        <strong> Item #: </strong> {{ skip.item }} <br>
                        <strong> # of Units Affected: </strong> {{ skip.units }} 
                    </div>
                    <div class="column">
                        <strong> Reason for Skip: </strong> {{ skip.reason }} <br>
                        <strong> Dept: </strong> {{ skip.dept }} 
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import { db } from "../main"
import EventBus from '../event-bus'

export default {
    name: 'completetab',
    props: {
        category: String,
        categories: Array
    },
    data() {
        return {
            skips: [],
            currentUser: '',
            today: ''
        }
    },
    mounted() {
        this.initAll()
        this.currentUser = firebase.auth().currentUser.email
    },
    firestore() {
        if(this.$props.category != 'All') {
            return {
                skips: db.collection('categories').doc(this.$props.category).collection('skips').where('completed', '==', true).orderBy('added', 'desc')
            }
        }
    },
    methods: {
        deleteSkip(skip, parent) {
            /* Removes skip from database, if selected from 'All' category
               make sure to remove properly */
               
            if(this.$props.category === 'All') {
                db.collection('categories').doc(parent).collection('skips').doc(skip.id).delete()

                let index
                for(let i = 0; i < this.skips.length; i++) {
                    if(skip.id === this.skips[i].id) {
                        index = i
                        break
                    }
                }
                this.skips.splice(index, 1)
            }else{
                db.collection('categories').doc(this.$props.category).collection('skips').doc(skip.id).delete()
            }
        },
        compare(a,b,) {
            if(a.schedule < b.schedule) {
                return -1
            }
            if(a.schedule > b.schedule) {
                return 1
            }
            return 0
        },
        initAll() {
            /* Lists skips from all departments (categories) */
            if(this.$props.category === 'All') {
                for (var i = 0; i < this.$props.categories.length; i++) {
                    const categoryID = this.$props.categories[i].id
                    db.collection('categories').doc(categoryID).collection('skips').where('completed', '==', true).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((collection) => {
                                if(collection){
                                    this.today = firebase.firestore.Timestamp.now().seconds
                                    if(this.today - collection.data().completeDate.seconds > 172800){
                                        console.log(this.today - collection.data().completeDate.seconds)
                                        this.deleteSkip(collection, collection.data().parent)
                                    }
                                }
                                this.skips.push({
                                    reason: collection.data().reason,
                                    schedule: collection.data().schedule,
                                    sequence: collection.data().sequence,
                                    item: collection.data().item,
                                    units: collection.data().units,
                                    dept: collection.data().dept,
                                    completed: collection.data().completed,
                                    parent: collection.data().parent,
                                    id: collection.id, 
                                    category: categoryID
                                })
                            })
                            this.skips.sort(this.compare)
                        })
                }
            }
        }
    }
    
}
</script>
