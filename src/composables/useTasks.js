import { ref, computed } from 'vue'
import { auth } from '../firebase/config'
import { fetchTodos } from '../api/todosApi'
import {
  getAssignedIds,
  ensureWorkspaceDoc,
  getWorkspaceTasks,
  assignTaskToUser,
} from '../firestore/tasksFirestore'

export function useTasks() {
  const tasks = ref([])
  const assignedSet = ref(new Set())

  const loading = ref(false)
  const error = ref(null)

  const filterValue = ref('all') 

  const tasksWithAssignment = computed(() => {
    const set = assignedSet.value
    return tasks.value.map((t) => ({
      ...t,
      assigned: set.has(String(t.id)),
    }))
  })

  const filteredTasks = computed(() => {
    const list = tasksWithAssignment.value

    if (filterValue.value === 'completed') return list.filter((t) => t.completed === true)
    if (filterValue.value === 'pending') return list.filter((t) => t.completed === false)
    if (filterValue.value === 'assigned') return list.filter((t) => t.assigned === true)
    return list
  })

  async function fetchTasks() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await fetchTodos()
    } catch (e) {
      error.value = e
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  async function cargarAssignments() {
    try {
      assignedSet.value = await getAssignedIds()
    } catch {
      assignedSet.value = new Set()
    }
  }

  async function initTablon() {
    await fetchTasks()
    await cargarAssignments()

    const u = auth.currentUser
    if (u?.uid) {
      try {
        await ensureWorkspaceDoc(u.uid)
      } catch {
      }
    }
  }

  async function assignTask(task) {
    const u = auth.currentUser
    if (!u) throw new Error('No hay sesión iniciada.')
    if (!u.emailVerified) throw new Error('Debes verificar el correo para asignar tareas.')
    if (task.completed) throw new Error('No se pueden asignar tareas finalizadas.')

    await assignTaskToUser({ uid: u.uid, task })

    const next = new Set(assignedSet.value)
    next.add(String(task.id))
    assignedSet.value = next
  }

  async function fetchWorkspaceTasks() {
    const u = auth.currentUser
    if (!u) return []
    return await getWorkspaceTasks(u.uid)
  }

  return {
    loading,
    error,
    filterValue,

    filteredTasks,

    initTablon,
    assignTask,
    fetchWorkspaceTasks,

    fetchTasks,
    cargarAssignments,
  }
}