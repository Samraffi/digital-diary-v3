import Link from 'next/link'

export default function Home() {
  return (
    <Link 
      href="/throne-room"
      className="p-6 rounded-lg bg-card hover:bg-card/90 transition-colors"
    >
      <h2 className="text-2xl font-medieval mb-2">👑 Тронный Зал</h2>
      <p className="text-muted-foreground">
        Управляйте своим королевством и развивайте территории
      </p>
    </Link>
  )
}
