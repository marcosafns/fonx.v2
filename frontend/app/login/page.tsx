'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }

      localStorage.setItem('token', data.access_token)
      router.push('/cart')
    } catch (err: any) {
      alert(err.message || 'Erro inesperado')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Entrar na Fonx</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-black text-white px-6 py-2 rounded hover:bg-zinc-800 transition-all w-full"
      >
        Entrar
      </button>
    </div>
  )
}
