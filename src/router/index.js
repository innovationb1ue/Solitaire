import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import * as path from "path";


const routes = [{
    path: '/',
    name: 'Home',
    component: HelloWorld
},
    {
        path: '/select',
        name: 'select',
        component: () => import( /* webpackChunkName: "about" */ '../views/SelectRoom.vue')
    },
    {
        path: '/menu',
        name: "menu",
        component: () => import('../views/Menu.vue')
    },
    {
        path: "/spider",
        name: "spider",
        component: () => import('../views/Spider.vue')
    }

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

