import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-medieval text-center mb-8">
          Добро пожаловать в Digital Diary
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/throne-room"
            className="p-6 rounded-lg bg-card hover:bg-card/90 transition-colors"
          >
            <h2 className="text-2xl font-medieval mb-2">👑 Тронный Зал</h2>
            <p className="text-muted-foreground">
              Управляйте своим королевством и развивайте территории
            </p>
          </Link>
          <Link 
            href="/diary"
            className="p-6 rounded-lg bg-card hover:bg-card/90 transition-colors"
          >
            <h2 className="text-2xl font-medieval mb-2">📖 Дневник</h2>
            <p className="text-muted-foreground">
              Записывайте свои мысли и достижения
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
