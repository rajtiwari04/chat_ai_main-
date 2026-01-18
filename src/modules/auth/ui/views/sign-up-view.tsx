"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, OctagonAlertIcon, Github, User, Mail, Lock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authClient } from "@/lib/auth-client"

const FormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters long"),
    confirmpassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
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
            confirmpassword: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setError(null)
        setPending(true)

        await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
        }, {
            onRequest: () => setPending(true),
            onSuccess: () => {
                setPending(false)
                router.push("/")
            },
            onError: (ctx) => {
                setPending(false)
                setError(ctx.error.message || "An error occurred during sign up")
            }
        })
    }

    const socialSignIn = async (provider: "google" | "github") => {
        await authClient.signIn.social({
            provider,
            callbackURL: "/"
        })
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[1100px]"
            >
                <Card className="overflow-hidden border-none shadow-2xl bg-card">
                    <CardContent className="p-0 flex flex-col md:flex-row min-h-[700px]">
                        
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                                <p className="text-muted-foreground mt-2">Join meet_ai and start collaborating today</p>
                            </div>

                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter Your Name" className="h-11" />
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
                                                        <Input {...field} type="email" placeholder="name@example.com" className="h-11" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="password" placeholder="••••••••" className="h-11" />
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
                                                        <FormLabel>Confirm Password</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="password" placeholder="••••••••" className="h-11" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <Alert variant="destructive" className="py-2">
                                                    <OctagonAlertIcon className="h-4 w-4" />
                                                    <AlertDescription className="text-xs">{error}</AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 text-base font-medium mt-2 transition-all active:scale-[0.98]" 
                                        disabled={pending}
                                    >
                                        {pending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : "Sign Up"}
                                    </Button>
                                </form>
                            </Form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-11" onClick={() => socialSignIn("google")} type="button">
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Google
                                </Button>
                                <Button variant="outline" className="h-11" onClick={() => socialSignIn("github")} type="button">
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </Button>
                            </div>

                            <p className="mt-8 text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <a href="/sign-in" className="text-primary font-semibold hover:underline underline-offset-4">
                                    Sign in
                                </a>
                            </p>
                        </div>

                        <div className="hidden md:flex flex-1 bg-muted items-center justify-center p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
                            <div className="relative z-10 text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform rotate-3">
                                        <img src="/logo.svg" alt="logo" className="w-12 h-12 brightness-0 invert -rotate-3"/>
                                    </div>
                                    <h2 className="text-4xl font-bold tracking-tight">meet_ai</h2>
                                    <p className="mt-4 text-muted-foreground max-w-[300px] text-lg">
                                        The future of intelligent collaboration starts here.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By clicking sign up, you agree to our{" "}
                    <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and{" "}
                    <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                </p>
            </motion.div>
        </div>
    )
}