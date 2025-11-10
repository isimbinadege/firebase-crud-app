'use client'
import { useState } from 'react'
import { db } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        completed: false,
        createdAt: new Date()
      })
      alert("✅ Task Added Successfully")
      setTitle('')
      setDescription('')
    } catch (err) {
      console.log(err)
      alert("❌ Failed to add task")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <form onSubmit={handleAddTask} className="space-y-4 w-80">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 w-full text-white p-2 rounded">Add Task</button>
      </form>
    </div>
  )
}
