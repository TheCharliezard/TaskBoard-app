import { ref } from 'vue'
import {
  subscribeAuth,
  registerWithEmail,
  loginWithEmail,
  logoutAuth,
  sendVerificationEmail,
  resendVerificationEmail,
  refreshCurrentUser,
} from '../firebase/authService'

const usuarioActual = ref(null)
const emailVerified = ref(false)
const authCarga = ref(false)

subscribeAuth((u) => {
  usuarioActual.value = u
  emailVerified.value = !!u?.emailVerified
  authCarga.value = true
})

async function register(email, password) {
  const response = { error: null }
  try {
    const cred = await registerWithEmail(email, password)
    await sendVerificationEmail(cred.user)
  } catch (err) {
    response.error = err
  }
  return response
}

async function login(email, password) {
  const response = { error: null, needsEmailVerification: false }
  try {
    const cred = await loginWithEmail(email, password)
    if (!cred.user.emailVerified) {
      response.needsEmailVerification = true
    }
  } catch (err) {
    response.error = err
  }
  return response
}

async function logout() {
  await logoutAuth()
}

async function resendEmail() {
  const response = { error: null }
  try {
    await resendVerificationEmail()
  } catch (err) {
    response.error = err
  }
  return response
}

async function refreshUser() {
  const response = { error: null }
  try {
    const u = await refreshCurrentUser()
    usuarioActual.value = u
    emailVerified.value = !!u?.emailVerified
  } catch (err) {
    response.error = err
  }
  return response
}

export function useAuth() {
  return {
    usuarioActual,
    emailVerified,
    authCarga,
    register,
    login,
    logout,
    resendVerificationEmail: resendEmail,
    refreshUser,
  }
}