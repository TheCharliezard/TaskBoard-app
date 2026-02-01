<template>
  <ul class="task-list">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @assign="handleAssign"
    />
    <li v-if="tasks.length === 0">No hay tareas disponibles.</li>
  </ul>
</template>


<script setup>
import TaskItem from './TaskItem.vue'
defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['assign'])

function handleAssign(task) {
  emit('assign', task)
}
</script>


<style scoped>
.task-list {
  padding: 0;
}
</style>