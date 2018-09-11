<template>
    <div>
        <div class="card" v-for="skip in skips" :key="skip.id">
            <div class="card-image">
            </div>
            <div class="card-content">
                <div class="">
                    Reason for Skip: {{ skip.reason }} <br>
                    Schedule: {{ skip.schedule }} <br>
                    Sequence: {{ skip.sequence }} <br>
                    Item #: {{ skip.item }} <br>
                    # of Unit Affected: {{ skip.units }} <br>
                    Dept: {{ skip.dept }}
                    {{this}}
                </div>
                <div class="buttons is-right">
                    <a @click="deleteSkip(skip)" class="button is-danger">Delete Skip</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "../main"

export default {
    name: 'SkipTab',
    props: {
        category: String,
        categories: Array
    },
    data() {
        return {
            skips: []
        }
    },
    mounted() {
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
                                id: collection.id, 
                                category: categoryID
                            })
                        })
                    })
            }
        }
    },
    firestore() {
        return {
            skips: db.collection('categories').doc(this.$props.category).collection('skips').orderBy('schedule')
        }
    },
    methods: {
        deleteSkip (skip) {
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
        }
    }
    
}
</script>
