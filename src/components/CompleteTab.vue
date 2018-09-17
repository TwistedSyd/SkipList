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
                    <div class="column is-one-fifth">
                        <div class="buttons is-right">
                            <a @click="deleteSkip(skip)" class="button is-danger">Delete Skip</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "../main"
import EventBus from '../event-bus'

export default {
    name: 'SkipTab',
    props: {
        category: String,
        categories: Array
    },
    data() {
        return {
            skips: [],
            selected: ''
        }
    },
    mounted() {
        setTimeout(() => {
            if(this.$props.category == 'All'){
                this.initAll()
            }
        }, 2000)
        EventBus.$on('Select', data => {
            this.selected = data.id
        })   
    },
    firestore() {
        return {
            skips: db.collection('categories').doc(this.$props.category).collection('skips').orderBy('schedule')
        }
    },
    methods: {
        deleteSkip(skip) {
            /* Removes skip from database, if selected from 'All' category
               make sure to remove properly */
            if(this.$props.category === 'All') {
                db.collection('categories').doc(skip.category).collection('skips').doc(skip.id).delete()

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
        initAll() {
            /* Lists skips from all departments (categories) */
            console.log("INIT ALL COMPLETE")
            if(this.$props.category === 'All') {
                for (var i = 0; i < this.$props.categories.length; i++) {
                    const categoryID = this.$props.categories[i].id
                    db.collection('categories').doc(categoryID).collection('skips').orderBy('schedule').get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((collection) => {
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
                        })
                }
            }
        }
    }
    
}
</script>
