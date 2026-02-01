import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    runTransaction,
    serverTimestamp,
    arrayUnion,
  } from 'firebase/firestore'
  import { db } from '../firebase/config'
  
  export async function getAssignedIds() {
    const snap = await getDocs(collection(db, 'assignments'))
    const set = new Set()
    snap.forEach((d) => set.add(d.id))
    return set
  }
  
  export async function ensureWorkspaceDoc(uid) {
    const ref = doc(db, 'workspaces', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, { tasks: [] })
    }
  }
  
  export async function getWorkspaceTasks(uid) {
    const ref = doc(db, 'workspaces', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return []
    const data = snap.data()
    return Array.isArray(data?.tasks) ? data.tasks : []
  }
  
  
  export async function assignTaskToUser({ uid, task }) {
    const taskId = String(task.id)
  
    await runTransaction(db, async (tx) => {
      const aRef = doc(db, 'assignments', taskId)
      const wRef = doc(db, 'workspaces', uid)
  
      const aSnap = await tx.get(aRef)
      if (aSnap.exists()) throw new Error('Esta tarea ya está asignada a otro usuario.')
  
      const wSnap = await tx.get(wRef)
      if (!wSnap.exists()) {
        tx.set(wRef, { tasks: [] })
      }
  
      tx.set(aRef, {
        taskId: task.id,
        text: task.todo,
        completed: false,
        assignedTo: uid,
        assignedAt: serverTimestamp(),
      })
  
      tx.set(
        wRef,
        { tasks: arrayUnion({ id: task.id, text: task.todo, completed: false }) },
        { merge: true }
      )
    })
  }