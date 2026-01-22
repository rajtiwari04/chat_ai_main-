"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {FaGoogle,FaGithub} from "react-icons/fa"
import { Loader2, OctagonAlertIcon, Github, User, Mail, Lock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

const FormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmpassword: z.string()
}).refine(d => d.password === d.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match"
})

export const SignupView = () => {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmpassword: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setError(null)
        setPending(true)

        await authClient.signUp.email(
            {
                name: data.name,
                email: data.email,
                password: data.password
            },
            {
                onSuccess: () => {
                    setPending(false)
                    router.push("/")
                },
                onError: (ctx) => {
                    setPending(false)
                    setError(ctx.error.message)
                }
            }
        )
    }

    const socialSignIn = async (provider: "google" | "github") => {
        await authClient.signIn.social({ provider, callbackURL: "/" })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl"
            >
                <Card className="overflow-hidden rounded-3xl shadow-2xl border-none">
                    <CardContent className="p-0 grid md:grid-cols-2 min-h-[720px]">
                        
                        <div className="flex flex-col justify-center px-8 md:px-12">
                            <div className="mb-10">
                                <h1 className="text-4xl font-bold tracking-tight">Create account</h1>
                                <p className="text-muted-foreground mt-3 text-sm">
                                    Start building smarter conversations with meet_ai
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input {...field} className="pl-10 h-11 rounded-xl" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input {...field} type="email" className="pl-10 h-11 rounded-xl" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input {...field} type="password" className="pl-10 h-11 rounded-xl" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="confirmpassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input {...field} type="password" className="pl-10 h-11 rounded-xl" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <Alert variant="destructive">
                                                    <OctagonAlertIcon className="h-4 w-4" />
                                                    <AlertDescription className="text-xs">
                                                        {error}
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        type="submit"
                                        disabled={pending}
                                        className="h-11 rounded-xl text-base font-semibold w-full"
                                    >
                                        {pending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating account
                                            </>
                                        ) : "Create account"}
                                    </Button>
                                </form>
                            </Form>

                            <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex-1 h-px bg-border" />
                                OR
                                <span className="flex-1 h-px bg-border" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="rounded-xl h-11" onClick={() => socialSignIn("google")}>
                                    Google
                                    <FaGoogle/>
                                </Button>
                                <Button variant="outline" className="rounded-xl h-11" onClick={() => socialSignIn("github")}>
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Already have an account?{" "}
                                <a href="/sign-in" className="font-semibold text-primary hover:underline">
                                    Sign in
                                </a>
                            </p>
                        </div>

                        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-center px-10"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
                                    <img src="/logo.svg" className="w-12 h-12 invert" />
                                </div>
                                <h2 className="text-4xl font-bold">meet_ai</h2>
                                <p className="mt-4 text-muted-foreground">
                                    Intelligent collaboration starts here
                                </p>
                            </motion.div>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
