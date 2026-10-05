import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="relative z-10 flex flex-col items-center">
        {/* Sleek branding above card */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            Note<span className="text-indigo-600 dark:text-indigo-400">Vault</span>
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to start your personal workspace
          </p>
        </div>

        {/* Clerk Sign-up Component */}
        <SignUp
          appearance={{
            elements: {
              card: "shadow-xl border border-border bg-card/90 backdrop-blur-xl rounded-2xl",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: 
                "border-border hover:bg-muted transition duration-200 text-foreground",
              formButtonPrimary: 
                "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-200",
              footerActionLink: "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold",
            }
          }}
        />
      </div>
    </div>
  );
}
