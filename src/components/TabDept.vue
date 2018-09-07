<template>
    <div>
        {{ $props.category}}
    </div>
</template>

<script>
import { db } from './main'

export default {
    name: 'TabDept',
    props: {
        category: String
    },
    data() {
        return {
            skips: []
        }
    },
    firestore() {
        return {
            skips: db.collection('categories').doc(this.$props.category).collection('skips')
        }
    }
}
</script>

