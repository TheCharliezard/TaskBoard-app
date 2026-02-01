<template>
  <div class="app-container">
    <header class="header">
      <h1>TaskBoard</h1>
      <div v-if="usuario && emailVerificado" class="menu">
        <router-link to="/">Tablón</router-link>
        <router-link to="/workspace">Área de trabajo</router-link>
        <button @click="logout">Cerrar sesión</button>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref } from 'vue'

const usuario = ref(null)
const emailVerificado = ref(false)
const router = useRouter()

const auth = getAuth()
onAuthStateChanged(auth, (u) => {
  usuario.value = u
  emailVerificado.value = u?.emailVerified ?? false
})

async function logout() {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error('Error al cerrar sesion:', err)
  }
}
</script>


<style scoped>
.app-container {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
}

.menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

button {
  padding: 0.3rem 0.3rem;
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .menu {
    width: 100%;
    justify-content: center;
  }
}
</style>