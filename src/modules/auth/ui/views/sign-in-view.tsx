"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, OctagonAlertIcon, Github } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {FaGoogle,FaGithub} from "react-icons/fa"

import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const SigninView = () => {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { email: "", password: "" },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (pending) return
        setError(null)
        setPending(true)

        await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => router.replace("/"),
                onError: () =>
                    setError("Invalid email or password"),
                onSettled: () => setPending(false),
            }
        )
    }

    const socialSignIn = async (provider: "google" | "github") => {
        if (pending) return
        setPending(true)
        await authClient.signIn.social({
            provider,
            callbackURL: "/",
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-5xl"
            >
                <Card className="overflow-hidden border-none shadow-2xl">
                    <CardContent className="p-0 grid md:grid-cols-2 min-h-[620px]">
                        <div className="p-10 flex flex-col justify-center">
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Welcome back
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Sign in to continue to meet_ai
                                </p>
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="name@example.com"
                                                        className="h-11"
                                                        disabled={pending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex justify-between">
                                                    <FormLabel>Password</FormLabel>
                                                    <a
                                                        href="/forgot-password"
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        Forgot password?
                                                    </a>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        className="h-11"
                                                        disabled={pending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                            >
                                                <Alert variant="destructive">
                                                    <OctagonAlertIcon className="h-4 w-4" />
                                                    <AlertTitle>Error</AlertTitle>
                                                    <AlertDescription>
                                                        {error}
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 text-base"
                                        disabled={pending}
                                    >
                                        {pending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing in
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-3 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-11"
                                    onClick={() => socialSignIn("google")}
                                    disabled={pending}
                                >
                                    Google
                                    <FaGoogle/>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="h-11"
                                    onClick={() => socialSignIn("github")}
                                    disabled={pending}
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </Button>
                            </div>

                            <p className="mt-8 text-center text-sm text-muted-foreground">
                                Don’t have an account?{" "}
                                <a
                                    href="/sign-up"
                                    className="font-semibold text-primary hover:underline"
                                >
                                    Sign up
                                </a>
                            </p>
                        </div>

                        <div className="hidden md:flex items-center justify-center bg-muted relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20" />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="relative z-10 text-center px-10"
                            >
                                <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
                                    <img
                                        src="/logo.svg"
                                        alt="meet_ai"
                                        className="w-12 h-12 invert"
                                    />
                                </div>
                                <h2 className="text-4xl font-bold">
                                    meet_ai
                                </h2>
                                <p className="mt-4 text-muted-foreground max-w-sm mx-auto">
                                    AI-powered interviews, meetings, and
                                    real-time insights.
                                </p>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <a className="underline hover:text-primary">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a className="underline hover:text-primary">
                        Privacy Policy
                    </a>
                </p>
            </motion.div>
        </div>
    )
}
