'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './lib/firebase'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

interface Task {
  id?: string
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
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserEmail(currentUser.email)
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
      alert("Task added successfully!")
      setTitle('')
      setDescription('')
      setPriority("Low")
    } catch (error: any) {
      alert(error.message)
    }
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

      {/* ✅ Task List will come here in the next step */}

    </div>
  )
}
