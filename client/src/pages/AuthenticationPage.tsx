import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, Mail, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

type AuthMode = "signup" | "signin";

const inputClassName =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function AuthenticationPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const isSignUp = mode === "signup";

  function handleSubmit() {}

  return (
    <main className="grid min-h-svh bg-primary/50 p-4 md:place-items-center md:p-8">
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl bg-background shadow-xl md:block md:min-h-155">
        <aside
          className={`relative hidden overflow-hidden bg-primary p-10 text-primary-foreground md:absolute md:inset-y-0 md:flex md:w-1/2 md:flex-col md:transition-[left] md:duration-700 md:ease-[cubic-bezier(.22,1,.36,1)] ${
            isSignUp ? "md:left-1/2" : "md:left-0"
          }`}
        >
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(1_0_0/0.22),transparent_45%)]" /> */}
          <div className="relative flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="size-5" />
            Shopify
          </div>

          <div className="relative my-30 max-w-sm">
            <p className="mb-3 text-sm font-medium tracking-[0.2em] uppercase text-primary-foreground/70">
              {isSignUp ? "Start Shopping" : "Welcome Back"}
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              {isSignUp
                ? "Find your favourite product"
                : "Continue shopping journey"}
            </h2>
            <p className="mt-5 leading-7 text-primary-foreground/80">
              {isSignUp
                ? "Create an account to save your wishlist and get selected offers."
                : "Sign in to check your orders, wish list, and personalized recommendations."}
            </p>
          </div>
        </aside>

        <div
          className={`flex min-h-155 flex-col justify-center px-6 py-10 sm:px-12 md:absolute md:inset-y-0 md:w-1/2 md:px-16 md:transition-[left] md:duration-700 md:ease-[cubic-bezier(.22,1,.36,1)] ${
            isSignUp ? "md:left-0" : "md:left-1/2"
          }`}
        >
          {/* <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <ShoppingBag className="size-5" /> Shoply
            </div>
          </div> */}

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8">
                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                  {isSignUp ? "Sign Up" : "Sign in"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isSignUp
                    ? "Fill in the form below to get started"
                    : "Fill your account credentials to continue"}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignUp && (
                  <label className="grid gap-2 text-sm font-medium">
                    Full Name
                    <span className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        className={`${inputClassName} pl-10`}
                        name="name"
                        placeholder="John Doe"
                        required
                      />
                    </span>
                  </label>
                )}
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <span className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className={`${inputClassName} pl-10`}
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                    />
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Password
                  <span className="relative">
                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className={`${inputClassName} pl-10`}
                      name="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                    />
                  </span>
                </label>

                {!isSignUp && (
                  <div className="flex items-center justify-between gap-4">
                    <FieldGroup className="w-auto">
                      <Field orientation="horizontal" className="gap-2">
                        <Checkbox id="remember-me" name="remember-me" />
                        <FieldLabel
                          htmlFor="remember-me"
                          className="text-sm font-medium text-muted-foreground whitespace-nowrap"
                        >
                          Remember Me
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button className="h-11 w-full text-sm" size="lg" type="submit">
                  {isSignUp ? "Create Account" : "Enter"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(isSignUp ? "signin" : "signup")}
                  className="font-semibold text-primary hover:underline"
                >
                  {isSignUp ? "I have an account" : "Create account"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
