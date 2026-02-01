<template>
  <div class="workspace">
    <h2>Mi área de trabajo</h2>
    <div v-if="cargando">Cargando tareas…</div>
    <div v-else>
      <p v-if="usuarioTasks.length === 0">
        No tienes tareas asignadas. Puedes agregarlas desde el tablón.
      </p>
      <ul v-else class="task-lista">
        <li v-for="task in usuarioTasks" :key="task.id" class="task-item">
          <span>{{ task.text }}</span>
            <b>{{ task.completed ? 'Completada' : 'Pendiente' }}</b>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasks } from '../composables/useTasks'

const { fetchWorkspaceTasks } = useTasks()

const cargando = ref(false)
const usuarioTasks = ref([])

async function cargarWorkspace() {
  cargando.value = true
  usuarioTasks.value = await fetchWorkspaceTasks()
  cargando.value = false
}

onMounted(() => {
  cargarWorkspace()
})
</script>

<style scoped>

.task-lista {
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}

@media (max-width: 600px) {
  .task-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>