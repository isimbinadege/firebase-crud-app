'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert('Logged in successfully!')
      router.push('/')
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">

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
            Login
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Do not have an account?{" "}
          <button
            onClick={() => router.push('/register')}
            className="text-green-800 font-semibold hover:underline"
          >
            Register
          </button>
        </p>

      </div>
    </div>
  )
}
