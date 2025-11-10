'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created successfully!')
      router.push('/login')
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input 
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Password</label>
            <input 
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-700 outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-800 hover:bg-green-900 text-white py-2 rounded-lg text-lg font-medium transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <button 
            onClick={() => router.push('/login')}
            className="text-green-800 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  )
}
