"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, BookOpen, Users, Building, Calendar, FileText, Star } from "lucide-react"
import Link from "next/link"

interface Book {
  isbn: string
  title: string
  subtitle?: string
  authors: string[]
  publisher?: string
  published_date?: string
  description?: string
  page_count?: number
  thumbnail?: string
  average_rating?: number
  ratings_count?: number
}

export default function BookDetailPage() {
  const { isbn } = useParams() as { isbn: string }
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isbn) return
    setLoading(true)
    fetch(
      process.env.NODE_ENV === "development"
        ? `http://localhost:8000/api/books/${isbn}/`
        : `https://isbn-backend.fly.dev/api/books/${isbn}/`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setBook(data.data)
        else setError(data.message)
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false))
  }, [isbn])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    )

  if (error || !book)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-300">
        <p className="mb-4">{error || "Book not found"}</p>
        <Link href="/">
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white">
            Back to Garden
          </button>
        </Link>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* back arrow */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="mb-6 flex items-center gap-2 text-orange-300 hover:text-orange-400"
          >
            <ArrowLeft size={20} /> Back to Garden
          </motion.button>
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* cover */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 flex justify-center"
          >
            <Image
              src={book.thumbnail || "/placeholder-cover.png"}
              alt={book.title}
              width={300}
              height={450}
              className="rounded-lg shadow-2xl"
              priority
            />
          </motion.div>

          {/* meta */}
          <div className="md:col-span-2 space-y-6">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 to-orange-200 bg-clip-text text-transparent"
            >
              {book.title}
            </motion.h1>
            {book.subtitle && (
              <p className="text-lg text-slate-400 italic">{book.subtitle}</p>
            )}

            <div className="space-y-3 text-slate-300">
              <InfoRow icon={<Users />} label="Authors" value={book.authors.join(", ")} />
              <InfoRow icon={<Building />} label="Publisher" value={book.publisher} />
              <InfoRow icon={<Calendar />} label="Published" value={book.published_date} />
              <InfoRow icon={<FileText />} label="Pages" value={book.page_count?.toString()} />
              {book.average_rating && (
                <InfoRow
                  icon={<Star />}
                  label="Rating"
                  value={`⭐ ${book.average_rating} (${book.ratings_count} ratings)`}
                />
              )}
            </div>

            {book.description && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="prose prose-invert prose-sm md:prose-base max-w-none"
              >
                <h3 className="text-xl font-semibold text-orange-300 mb-2">Description</h3>
                <p className="text-slate-400 leading-relaxed">{book.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* helper */
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-orange-400">{icon}</span>
      <span className="font-medium text-slate-200">{label}:</span>
      <span className="text-slate-300">{value}</span>
    </div>
  )
}