import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* Firebase, firestore and vuefire */
import firebase from 'firebase'
import VueFire from 'vuefire'
import 'firebase/firestore'

Vue.config.productionTip = false
Vue.use(VueFire)

/* Initialize firebase/firestore for project */
var config = {
    apiKey: "AIzaSyDxvDp0IIGuuJk3FiTuYeMGApH7nCLXgxI",
    authDomain: "skiplist-48b4d.firebaseapp.com",
    databaseURL: "https://skiplist-48b4d.firebaseio.com",
    projectId: "skiplist-48b4d",
    storageBucket: "skiplist-48b4d.appspot.com",
    messagingSenderId: "305476120066"
};
firebase.initializeApp(config);

/* Get database from firebase to use */
export const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
