"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export default function Home() {
  const { data: session } = authClient.useSession()

  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [password, setpassword] = useState("")

  const onRegister = () => {
    authClient.signUp.email(
      { email, password, name },
      {
        onError: () => {
          window.alert("Registration failed")
        },
        onSuccess: () => {
          window.alert("Registration successful. Please login")
        }
      }
    )
  }

  const onLogin = () => {
    authClient.signIn.email(
      { email, password },
      {
        onError: () => {
          window.alert("Invalid email or password")
        },
        onSuccess: () => {
          window.alert("Login successful")
        }
      }
    )
  }

  if (session) {
    return (
      <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold">
          You are logged in as {session.user?.name || session.user?.email}
        </h2>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <Input
        type="text"
        placeholder="Name (only for registration)"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
      />
      <Button onClick={onLogin}>Login</Button>
      <Button variant="outline" onClick={onRegister}>
        Register
      </Button>
    </div>
  )
}
