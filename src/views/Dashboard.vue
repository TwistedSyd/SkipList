<template>
    <div>
        <div class="tabs" id="sidebar">
            <ul>
                <li :class="{ 'is-active' : activeCategory === 'All'}"><a @click="setCategory('All')">All</a></li>
                <li v-for="category in categories" :key="category.title" :class="{ 'is-active' : activeCategory === category.title}">
                    <a @click="setCategory(category.title)">{{ category.title }}</a>
                </li>
            </ul>
        </div>
        <div v-if="activeCategory == ''">
            Please select an option above to view skips.
        </div>
        <div class="Message" v-if="activeCategory != 'All'">
            <article class="message is-danger">
                <div class="message-header">
                    <p>This department may be affected by Skips in the following departments:</p>
                </div>
                <div class="message-body">
                </div>
            </article>
        </div>
        <div class="Message" v-else>
            <article class="message is-info">
                <div class="message-header">
                    <p>Skips from all departments:</p>
                </div>
            </article>
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
        <div class="Message" v-if="activeCategory != 'All'">
            <article class="message is-success">
                <div class="message-header">
                    <p>Completed Skips from this department:</p>
                </div>
                <div class="message-body">
                </div>
            </article>
        </div>
        <div class="Message" v-else>
            <article class="message is-success">
                <div class="message-header">
                    <p>Completed Skips from all departments:</p>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import { db } from '../main'
import SkipTab from '../components/SkipTab.vue'
import EventBus from '../event-bus'

export default {
    name: 'dashboard',
    components: {
        SkipTab
    },
    data() {
        return {
            activeCategory: '',
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