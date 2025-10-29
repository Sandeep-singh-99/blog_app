export const dynamic = 'force-dynamic';


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      </div>
    </div>
  )
}
