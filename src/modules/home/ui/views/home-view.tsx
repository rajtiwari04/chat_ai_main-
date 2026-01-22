"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const HomeView = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
    }
  }, [isPending, session, router])

  if (isPending) {
    return <p>loading ...</p>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">
        You are logged in as {session.user?.name || session.user?.email}
      </h2>

      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }
      >
        Sign Out
      </Button>
    </div>
  )
}

export default HomeView
