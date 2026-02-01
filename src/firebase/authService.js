import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth'
  import { auth } from './config'
  
  export function subscribeAuth(callback) {
    return onAuthStateChanged(auth, callback)
  }
  
  export async function registerWithEmail(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
  }
  
  export async function loginWithEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
  }
  
  export async function logoutAuth() {
    return await signOut(auth)
  }
  
  export async function sendVerificationEmail(user) {
    return await sendEmailVerification(user)
  }
  
  export async function resendVerificationEmail() {
    const user = auth.currentUser
    if (!user) throw new Error('No hay sesión iniciada. Vuelve a iniciar sesión.')
    return await sendEmailVerification(user)
  }
  
  export async function refreshCurrentUser() {
    const user = auth.currentUser
    if (!user) throw new Error('No hay sesión iniciada.')
    await user.reload()
    await user.getIdToken(true)
    return auth.currentUser
  }