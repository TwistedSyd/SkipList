<template>
    <div>
        <!-- Dashboard view, selectedable departments listed here -->
        <div class="tabs is-toggle">
            <ul>
                <li :class="{ 'is-active' : activeCategory === 'All'}">
                    <a @click="setCategory('All')">All</a>
                </li>
                <li v-for="category in categories" :key="category.title" :class="{ 'is-active' : activeCategory === category.title}">
                    <a @click="setCategory(category.title, category.id, category.upline, category.count)">{{ category.title }} &nbsp;&nbsp;<span class="badge is-badge-danger is-medium" :data-badge="category.count"></span>&nbsp;&nbsp;&nbsp;</a>
                </li>
            </ul>
        </div>
        <!-- Header for skips that may affect up/downline departments -->
        <div class="Message" v-if="activeCategory != 'All' && activeCategory != ''">
            <article class="message is-danger">
                <div class="message-header">
                    <p>This department may be affected by Skips in the following departments:</p>
                </div>
                <div class="message-body">
                    <li v-for="depts in upline" :key="depts.id" v-if="depts.count > 0">
                        {{ depts.title}} ({{depts.count}}) 
                    </li>
                </div>
            </article>
        </div>
        <!-- Header for 'All' skips that are NOT completed -->
        <div class="Message" v-else>
            <article class="message is-info">
                <div class="message-header">
                    <p>Skips from all departments:</p>
                </div>
            </article>
        </div>
        <div class="container" id="flower" v-if="showLoader == true && activeCategory == 'All'">
            <flower-spinner
                :animation-duration="2000"
                :size="150"
                :color="'#209CEE'"
            />
        </div>
        <!-- List of skips in the 'All' category
             pulled from the SkipTab component -->
        <skip-tab
            category="All"
            v-if="activeCategory == 'All'"
            :categories="categories">
        </skip-tab>
        <!-- List of skips in particular department
             pulled from SkipTab component -->
        <skip-tab
            v-for="category in categories"
            :key="category.id"
            :category="category.id"
            v-if="activeCategory == category.title">
        </skip-tab>
        <!-- Header for particular category, skips that ARE completed
             pulled from CompleteTab -->
        <div class="Message" v-if="activeCategory != 'All'">
            <article class="message is-success">
                <div class="message-header">
                    <p>Completed Skips from this department:</p>
                </div>
            </article>
        </div>
        <!-- Header for 'All' category, ALL skips that ARE completed -->
        <div class="Message" v-else>
            <article class="message is-success">
                <div class="message-header">
                    <p>Completed Skips from all departments:</p>
                </div>
            </article>
        </div>
        <!-- List of skips in the 'All' category
             pulled from the CompleteTab component -->
        <complete-tab
            category="All"
            v-if="activeCategory == 'All'"
            :categories="categories">
        </complete-tab>
        <!-- List of skips in particular department
             pulled from the CompleteTab component -->
        <complete-tab
            v-for="category in categories"
            :key="category.title"
            :category="category.id"
            v-if="activeCategory == category.title">
        </complete-tab>
    </div>
</template>

<script>
import { db } from '../main'
import SkipTab from '../components/SkipTab.vue'
import CompleteTab from '../components/CompleteTab.vue'
import EventBus from '../event-bus'
import {FlowerSpinner} from 'epic-spinners'

export default {
    name: 'dashboard',
    components: {
        SkipTab,
        CompleteTab,
        FlowerSpinner
    },
    data() {
        return {
            activeCategory: '',
            activeID: '',
            categories: [],
            upline: [],
            showLoader: true,
            refreshed: true,
        }
    },
    updated() {
        if(this.refreshed){
            this.refreshed = false
            this.setCategory('All')
        }
    },
    firestore() {
        return {
            categories: db.collection('categories').orderBy('flow')
        }
    },
    methods: {
        setCategory(title, id, upline, count) {
            /* Set the current department that is selected in the 
               dashboard view */
            this.activeCategory = title
            this.activeID = id
            this.upline = upline
            EventBus.$emit('selectNone')
            if(this.activeCategory == 'All'){
                this.showLoader = true
                setTimeout(() => {
                    this.showLoader = false
                }, 2000)
            }
        }
    },
}
</script>
