import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/groups',
        name: 'Groups',
        component: () => import('../views/Groups'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/group/:group_id',
        name: 'Group',
        component: () => import('../views/Group'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register'),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '*',
        name: '404',
        component: () => import('../views/404')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!firebase.auth().currentUser) {
            next({
                path: '/',
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router
