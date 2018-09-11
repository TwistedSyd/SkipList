<template>
    <div>

        <h1>Departments</h1>
        <div class="tabs">
            <ul>
                <li :class="{ 'is-active' : activeCategory === 'All'}"><a @click="setCategory('All')">All</a></li>
                <li v-for="category in categories" :key="category.title" :class="{ 'is-active' : activeCategory === category.title}">
                    <a @click="setCategory(category.title)">{{ category.title }}</a>
                </li>
            </ul>
        </div>

        <skip-tab
            category="All"
            v-if="activeCategory == 'All'"
            :categories="categories">

        </skip-tab>

        <skip-tab
            v-for="category in categories"
            :key="category.id"
            :category="category.id"
            v-if="activeCategory == category.title">
        </skip-tab>
    </div>
</template>

<script>
import { db } from '../main'
import SkipTab from '../components/SkipTab.vue'

export default {
    name: 'dashboard',
    components: {
        SkipTab
    },
    data() {
        return {
            activeCategory: 'All',
            categories: []
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
    },
}
</script>

