import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const VerifyEmail = () => import('../views/VerifyEmail.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Workspace = () => import('../views/Workspace.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresUnauth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresUnauth: true },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: Workspace,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let authReady = false
const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authReady = true
      unsubscribe()
      resolve(user)
    })
  })

router.beforeEach(async (to) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresUnauth = to.meta.requiresUnauth

  let user = auth.currentUser
  if (!authReady) {
    user = await getCurrentUser()
  }

  if (requiresAuth) {
    if (!user) return '/login'
    if (!user.emailVerified && to.name !== 'verify-email') return '/verify-email'
    return true
  }

  if (requiresUnauth && user) {
    if (!user.emailVerified) return '/verify-email'
    return '/'
  }

  return true
})

export default router