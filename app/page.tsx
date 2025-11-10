'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './lib/firebase'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp, query, where, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "Low" | "Medium" | "High"
  userEmail: string | null
}

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low")
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email)

        // ✅ Fetch tasks in real-time
        const q = query(collection(db, "tasks"), where("userEmail", "==", currentUser.email))
        onSnapshot(q, (snapshot) => {
          const taskList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })) as Task[]
          setTasks(taskList)
        })

      } else {
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return alert("Please fill all fields")

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        completed: false,
        priority,
        userEmail,
        createdAt: serverTimestamp(),
      })
      setTitle('')
      setDescription('')
      setPriority("Low")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const markCompleted = async (id: string) => {
    await updateDoc(doc(db, "tasks", id), { completed: true })
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id))
  }

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center p-8 space-y-6">

      {/* Dashboard Header */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          Hello, {userEmail}
        </h1>
        <p className="text-gray-700 mb-6">Welcome to your Task Dashboard 👋</p>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Task Form */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-4">

          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-700 outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white py-2 rounded-lg font-medium transition"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* ✅ Task Cards */}
      <div className="w-full max-w-2xl grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">

            <h3 className="text-lg font-semibold">{task.title}</h3>

            <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1
              ${task.priority === "High" ? "bg-red-200 text-red-700" :
               task.priority === "Medium" ? "bg-yellow-200 text-yellow-700" :
               "bg-green-200 text-green-700"}`}>
              {task.priority}
            </span>

            <p className="mt-2 text-gray-600">{task.description}</p>

            {task.completed ? (
              <p className="text-green-700 font-semibold mt-3">✅ Completed</p>
            ) : (
              <button 
                onClick={() => markCompleted(task.id)}
                className="w-full bg-green-700 text-white py-1 rounded mt-3"
              >
                Mark as Completed
              </button>
            )}

            <button 
              onClick={() => deleteTask(task.id)}
              className="w-full bg-red-600 text-white py-1 rounded mt-2"
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
