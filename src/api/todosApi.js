import axios from 'axios'

export async function fetchTodos() {
  const res = await axios.get('https://dummyjson.com/todos', {
  })

  return Array.isArray(res.data?.todos) ? res.data.todos : []
}