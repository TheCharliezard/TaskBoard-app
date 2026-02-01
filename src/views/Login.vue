<template>
  <div class="container">
    <h2>Inicio sesión</h2>

    <form>
      <div class="form">
        <label for="email">Correo electrónico</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div class="form">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="button" :disabled="cargando" @click="iniciarSesion">
        {{ cargando ? 'Iniciando…' : 'Iniciar sesión' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="necesitaVerificacion" class="aviso-verificacion">
        Tu email no está verificado. Por favor revisa tu correo antes de intentar entrar.
      </p>
    </form>

    <p>
      ¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link>
    </p>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')
const necesitaVerificacion = ref(false)

function authError(err) {
  const code = err?.code || ''

  switch (code) {
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.'
    case 'auth/invalid-email':
      return 'El formato del correo no es válido.'
    case 'auth/user-disabled':
      return 'Esta cuenta está inhabilitada.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento y prueba otra vez.'
    case 'auth/network-request-failed':
      return 'Problema de red. Revisa tu conexión e inténtalo de nuevo.'
    default:
      return 'No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.'
  }
}

async function iniciarSesion() {
  error.value = ''
  necesitaVerificacion.value = false
  cargando.value = true

  const res = await login(email.value, password.value)

  cargando.value = false

  if (res.error) {
    error.value = authError(res.error)
  } else if (res.necesitaVerificacion) {
    router.push('/verify-email')
  } else {
    router.push('/')
  }
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

.aviso-verificacion {
  color: orange;
}

@media (max-width: 600px) {
  button {
    width: 100%;
  }
}
</style>