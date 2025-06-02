'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const router = useRouter()

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3333/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      alert('Erro ao cadastrar!')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
      <input type="text" name="name" placeholder="Nome" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
