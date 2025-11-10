'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './lib/firebase'
import { useRouter } from 'next/navigation'
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  Unsubscribe,
} from 'firebase/firestore'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'Low' | 'Medium' | 'High'
  userEmail: string | null
}

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const router = useRouter()

  useEffect(() => {
    let unsubSnapshot: Unsubscribe | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email)

        const q = query(collection(db, 'tasks'), where('userEmail', '==', currentUser.email))
        unsubSnapshot = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Task),
          }))
          setTasks(list)
        })
      } else {
        setUserEmail(null)
        setTasks([])
        router.push('/login')
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubSnapshot) unsubSnapshot()
    }
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return alert('Please fill all fields')

    await addDoc(collection(db, 'tasks'), {
      title,
      description,
      completed: false,
      priority,
      userEmail,
      createdAt: serverTimestamp(),
    })

    setTitle('')
    setDescription('')
    setPriority('Low')
  }

  const handleEditSave = async () => {
    if (!editingTask) return
    await updateDoc(doc(db, 'tasks', editingTask.id), {
      title: editingTask.title,
      description: editingTask.description,
      priority: editingTask.priority,
    })
    setEditingTask(null)
  }

  const toggleCompleted = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'tasks', id), { completed: !current })
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return
    await deleteDoc(doc(db, 'tasks', id))
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 md:p-10">
      
      {/* ✅ Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-5xl mx-auto mb-8">
        <div>
          <h1 className="text-2xl font-bold text-green-900">Hello, {userEmail}</h1>
          <p className="text-sm text-gray-600">Welcome to your Task Dashboard 👋</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ✅ Add Task Form styled like cards */}
        <div className="bg-white p-6 rounded-xl shadow border flex flex-col justify-between">
          <h2 className="text-xl font-bold text-green-800 mb-4">Add Task</h2>

          <form onSubmit={handleAddTask} className="space-y-4">
            <input
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-600"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-600 h-28"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-600"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900 text-white py-2 rounded-lg"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Tasks</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tasks.length === 0 && (
              <div className="col-span-full text-center text-gray-500">No tasks yet — add one!</div>
            )}

            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow border flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>

                    <span className={`px-3 py-1 rounded-full text-xs ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className={`mt-2 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => toggleCompleted(task.id, task.completed)}
                    className={`flex-1 py-2 rounded text-white ${
                      task.completed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-700 hover:bg-green-800'
                    }`}
                  >
                    {task.completed ? 'Mark Incomplete' : 'Complete'}
                  </button>

                  <button
                    onClick={() => setEditingTask(task)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                  >
                    Delete
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  {task.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="font-bold text-lg mb-2">Edit Task</h3>

            <input
              className="border w-full px-3 py-2 rounded mb-2"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />

            <textarea
              className="border w-full px-3 py-2 rounded mb-2 h-28"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            />

            <select
              value={editingTask.priority}
              onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
              className="border w-full px-3 py-2 rounded mb-3"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div className="flex gap-2">
              <button onClick={handleEditSave} className="flex-1 bg-green-700 text-white py-2 rounded">
                Save
              </button>
              <button onClick={() => setEditingTask(null)} className="flex-1 bg-gray-500 text-white py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
