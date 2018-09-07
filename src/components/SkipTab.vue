<template>
    <div>
        <div class="card" v-for="skip in skips" :key="skip.id">
            <div class="card-image">
            </div>
            <div class="card-content">
                <div class="">
                    Title: {{ skip.title }} 
                    Item #: {{ skip.item }}
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
                db.collection('categories').doc(categoryID).collection('skips').orderBy('title').get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((collection) => {
                            this.skips.push({
                                title: collection.data().title,
                                item: collection.data().item,
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
            skips: db.collection('categories').doc(this.$props.category).collection('skips').orderBy('title')
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
