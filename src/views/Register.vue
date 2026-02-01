<template>
  <div class="container">
    <h2>Registro</h2>

    <form>
      <div class="form">
        <label for="email">Correo electrónico</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div class="form">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="button" :disabled="cargando" @click="registrarse">
        {{ cargando ? 'Registrando…' : 'Registrarse' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <p>
      ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register } = useAuth()

const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

function registerError(err) {
  const code = err?.code || ''

  switch (code) {
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/invalid-email':
      return 'El formato del correo no es válido.'
    case 'auth/email-already-in-use':
      return 'Ese correo ya está registrado. Prueba a iniciar sesión.'
    case 'auth/network-request-failed':
      return 'Problema de red. Revisa tu conexión e inténtalo de nuevo.'
    default:
      return 'No se pudo crear la cuenta. Inténtalo de nuevo.'
  }
}

async function registrarse() {
  error.value = ''
  cargando.value = true

  const res = await register(email.value, password.value)

  cargando.value = false

  if (res?.error) {
    error.value = registerError(res.error)
    return
  }

  
  router.push('/verify-email')
}
</script>



<style scoped>
.container {
  max-width: 350px;
  margin: 0 auto;
  margin-top: 50px;
}

.form {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.error {
  color: red;
}


@media (max-width: 600px) {
  button {
    width: 100%;
  }
}

</style>