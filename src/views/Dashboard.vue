<template>
    <div>
        <h1>Dashboard</h1>

        <div class="tabs">
            <ul>
                <li :class="{ 'is-active' : activeCategory === 'Newest'}"><a @click="setCategory('Newest')">Newest</a></li>
                <li v-for="category in categories" :key="category.title" :class="{ 'is-active' : activeCategory === category.title}">
                    <a @click="setCategory(category.title)">{{ category.title }}</a>
                </li>
            </ul>
        </div>
        <tab-dept 
            v-for="category in categories"
            :key="category.id"
            :category="category.id">
        </tab-dept>
    </div>
</template>

<script>
import { db } from '../main'
import TabDept from '../components/TabDept.vue'
export default {
    name: 'dashboard',
    components: { TabDept },
    data() {
        return {
            categories: [],
            activeCategory: 'Newest'
        }
    },
    firestore() {
        return {
            categories: db.collection('categories').orderBy('flow')
        }
    },
    methods: {
        setCategory(title) {
            this.activeCategory = title
        }
    }
}
</script>

