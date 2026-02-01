<template>
  <div class="container">
    <h2>Verifica tu correo electrónico</h2>

    <p>
      Te hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada (o spam)
      y sigue las instrucciones. Una vez verificado, <b>recarga</b> la página para acceder a la aplicación.
    </p>

    <div class="acciones">
      <button @click="reenviar" :disabled="enviando">
        {{ enviando ? 'Enviando…' : 'Reenviar correo de verificación' }}
      </button>

      <button class="btn-cerrar-sesion" @click="cerrarSesion" :disabled="cerrandoSesion">
        {{ cerrandoSesion ? 'Cerrando…' : 'Cerrar sesión' }}
      </button>
    </div>

    <p v-if="message" class="exito">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const {
  usuarioActual,
  emailVerified,
  authCarga,
  resendVerificationEmail,
  refreshUser,
  logout,
} = useAuth()

const enviando = ref(false)
const cerrandoSesion = ref(false)
const message = ref('')
const error = ref('')

async function reenviar() {
  message.value = ''
  error.value = ''
  enviando.value = true

  const res = await resendVerificationEmail()

  enviando.value = false

  if (res?.error) {
    error.value = res.error.message || 'No se pudo reenviar el correo.'
    return
  }

  message.value = 'Correo de verificación reenviado. Revisa tu bandeja de entrada.'
}

async function cerrarSesion() {
  error.value = ''
  message.value = ''
  cerrandoSesion.value = true
  await logout()
  cerrandoSesion.value = false
  router.replace('/login')
}

onMounted(async () => {
  if (!authCarga.value) {
    await new Promise((resolve) => {
      const stop = watch(authCarga, (v) => {
        if (v) {
          stop()
          resolve()
        }
      })
    })
  }

  if (!usuarioActual.value) {
    router.replace('/login')
    return
  }

  await refreshUser()

  if (emailVerified.value) {
    router.replace('/')
  }
})
</script>


<style scoped>
.container { 
  max-width: 450px; 
  margin: 0 auto; 
  padding: 70px; 
  text-align: center;
  line-height: 20px;
}

.acciones { 
  display: flex; 
  gap: 12px; 
  margin-top: 16px; 
  flex-wrap: wrap; 
  justify-content: center;
}

.exito { margin-top: 12px; }
.error { margin-top: 12px; }

</style>