<template>
  <li class="task-id">
    <div class="task-info">
      <span class="task-texto">{{ task.todo }}</span>
      <span class="estado" :class="{ completed: task.completed }">
        {{ task.completed ? '-Completada' : '-Pendiente' }}
      </span>
    </div>

    <div class="acciones">
      <button
        v-if="!task.completed && !task.assigned"
        @click="asignarTask"
      >
        Agregar
      </button>
      <span v-else-if="task.completed"></span>
      <span v-else>Asignada</span>
    </div>
  </li>
</template>


<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['assign'])

const { task } = toRefs(props)

function asignarTask() {
  emit('assign', task.value)
}
</script>


<style scoped>
.task-id {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 5px;
}

.task-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.estado.completed {
  color: green;
  font-weight: 100;
}

.estado {
  font-weight: 700;
}

.acciones button {
  padding: 0.3rem 0.3rem;
}

@media (max-width: 600px) {
  .task-id {
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-info {
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .acciones {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
  }

}
</style>