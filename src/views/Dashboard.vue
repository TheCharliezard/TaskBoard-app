<template>
  <div class="dashboard">
    <h2>Tablón de tareas</h2>
    <div class="controles">
      <label>
        Filtrar:
        <select v-model="filterValue">
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
          <option value="assigned">Asignadas</option>
        </select>
      </label>
      <button @click="recargarTasks">Recargar</button>
    </div>
    <div v-if="loading">Cargando tareas…</div>
    <div v-else-if="error" class="error">{{ errorMessage }}</div>
    <TaskList v-else :tasks="filteredTasks" @assign="handleAssign" />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useTasks } from '../composables/useTasks'
import TaskList from '../components/TaskList.vue'

const {
  loading,
  error,
  filterValue,
  filteredTasks,
  initTablon,
  assignTask,
} = useTasks()

onMounted(async () => {
  await initTablon()
})

function recargarTasks() {
  initTablon()
}

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value?.message || String(error.value)
})

async function handleAssign(task) {
  try {
    await assignTask(task)
  } catch (err) {
    alert(err.message)
  }
}
</script>


<style scoped>

.controles {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.error {
  color: red;
}
@media (max-width: 450px) {
  .controles {
    flex-direction: column;
    align-items: center;
  }

  .controles select{
    width: 150px;
  }

  .controles button {
    width: 80%;
  }
}
</style>