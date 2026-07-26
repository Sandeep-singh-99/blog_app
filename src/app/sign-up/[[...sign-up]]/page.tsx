import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-black px-6 py-12">
      {/* Background radial gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.2),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(67,56,202,0.2),transparent_40%)]" />
      
      {/* Subtle floating ambient light */}
      <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 dark:bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Sleek branding above card */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BitWrite
            </span>
            <span className="ml-1.5 text-gray-900 dark:text-white">App</span>
          </span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create an account to start sharing your stories
          </p>
        </div>

        {/* Clerk Sign-up Component */}
        <SignUp
          appearance={{
            elements: {
              card: "shadow-2xl border border-gray-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl",
              headerTitle: "text-gray-900 dark:text-white font-bold",
              headerSubtitle: "text-gray-500 dark:text-gray-400",
              socialButtonsBlockButton: 
                "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition duration-200 text-gray-700 dark:text-gray-200",
              formButtonPrimary: 
                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition duration-200",
              footerActionLink: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold",
            }
          }}
        />
      </div>
    </div>
  );
}
