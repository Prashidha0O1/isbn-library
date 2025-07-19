"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Book,
  Users,
  Building,
  ArrowRight,
  Database,
  Zap,
  Star,
  Sparkles,
  Globe,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"

// Floating particles component with theme colors
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30"
          style={{
            background: i % 3 === 0 ? "#FF6B6B" : i % 3 === 1 ? "#81C784" : "#FFF8E1",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          // Combine all style properties into a single style prop to avoid duplicate attributes
          // style={{
          //   background: i % 3 === 0 ? "#FF6B6B" : i % 3 === 1 ? "#81C784" : "#FFF8E1",
          //   left: `${Math.random() * 100}%`,
          //   top: `${Math.random() * 100}%`,
          // }}
        />
      ))}
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

// Glowing orb component with theme colors
const GlowingOrb = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute w-96 h-96 rounded-full opacity-20"
    style={{
      background: "radial-gradient(circle, rgba(255,107,107,0.4) 0%, rgba(129,199,132,0.3) 50%, transparent 70%)",
      filter: "blur(40px)",
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      delay,
      ease: "easeInOut",
    }}
  />
)

// Spotlight effect component
const Spotlight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  return (
    <motion.div
      className="absolute inset-0 opacity-30 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,107,107,0.15), rgba(129,199,132,0.1) 40%, transparent 70%)`,
      }}
    />
  )
}

export default function CoolLandingPage() {
  const { scrollYProgress } = useScroll()
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -200])
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
      {/* Floating particles */}
      <FloatingParticles />

      {/* Glowing orbs with theme colors */}
      <GlowingOrb delay={0} />
      <GlowingOrb delay={2} />

      {/* Header */}
      <motion.header
        className="relative z-50 px-4 lg:px-6 h-20 flex items-center backdrop-blur-md bg-slate-800/80 border-b border-slate-600/30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative w-12 h-12 mr-3">
            <Image src="/logo.png" alt="ISBN Book Search Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
              ISBN
            </span>
            <span className="text-xs text-slate-300 -mt-1 tracking-wider">BOOK SEARCH</span>
          </div>
        </motion.div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {["Features", "Demo", "API"].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-300 hover:text-orange-300 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section with Spotlight */}
        <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
          {/* Spotlight Effect */}
          <Spotlight />

          <div className="container max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Logo showcase */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 1.2, type: "spring" }}
                className="flex justify-center mb-8"
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-green-400/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <Image src="/logo.png" alt="ISBN Book Search Logo" fill className="object-contain relative z-10" />
                </div>
              </motion.div>

              {/* Animated badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              >
                <Badge className="bg-gradient-to-r from-orange-500/20 to-green-500/20 border-orange-400/30 text-orange-200 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Blooming with Book Knowledge
                </Badge>
              </motion.div>

              {/* Main heading with staggered animation */}
              <div className="space-y-4">
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  {["Discover", "Every", "Book"].map((word, index) => (
                    <motion.span
                      key={word}
                      className="inline-block mr-4 bg-gradient-to-r from-slate-100 via-orange-200 to-green-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        delay: 0.7 + index * 0.2,
                        duration: 0.8,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  <motion.span
                    className="bg-gradient-to-r from-orange-400 via-red-400 to-green-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.8, type: "spring" }}
                  >
                    Instantly
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="mx-auto max-w-3xl text-lg md:text-xl text-slate-300 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  Like flowers blooming from pages, our AI-powered system reveals comprehensive book information from
                  any ISBN. Cultivate your literary garden with instant access to titles, authors, publishers, and more.
                </motion.p>
              </div>

              {/* Search box with floral theme */}
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.8, type: "spring" }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex gap-3 p-3 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-600/30">
                    <Input
                      type="text"
                      placeholder="Plant an ISBN and watch knowledge bloom..."
                      className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-400 focus:ring-0 text-lg"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none shadow-lg shadow-orange-500/25"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Bloom
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <motion.p
                  className="text-sm text-slate-400 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  Try: 9780134685991 • 978-0-7432-7356-5 • 0-545-01022-5
                </motion.p>
              </motion.div>

              {/* Stats with floral theme */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                {[
                  { label: "Books Discovered", value: 1250000, icon: Book },
                  { label: "Garden Sources", value: 12, icon: Database },
                  { label: "Bloom Rate", value: 99, suffix: "%", icon: TrendingUp },
                  { label: "Growth Speed", value: 150, suffix: "ms", icon: Zap },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center group"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + index * 0.1, duration: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-slate-600/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300"
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className="w-6 h-6 text-orange-300" />
                      </motion.div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-slate-100">
                      <AnimatedCounter end={stat.value} />
                      {stat.suffix}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-6 h-10 border-2 border-slate-400/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-1 h-3 bg-orange-400/80 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with Parallax and Floral Theme */}
        <motion.section id="features" className="relative py-32 px-4 md:px-6" style={{ y: yRange }}>
          <div className="container max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-orange-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
              >
                Cultivated with Advanced Technology
              </motion.h2>
              <motion.p
                className="text-xl text-slate-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                Our intelligent garden grows knowledge from multiple sources, nurturing comprehensive book information
                that blooms instantly at your fingertips.
              </motion.p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Book,
                  title: "Complete Book Bouquet",
                  description: "Title, subtitle, edition, pages, description, cover images, and more.",
                  gradient: "from-orange-500 to-red-500",
                  delay: 0,
                },
                {
                  icon: Users,
                  title: "Author's Garden",
                  description: "Comprehensive author profiles, biographies, and complete bibliographies.",
                  gradient: "from-green-500 to-teal-500",
                  delay: 0.1,
                },
                {
                  icon: Building,
                  title: "Publisher's Greenhouse",
                  description: "Publisher info, dates, formats, languages, categories, and availability.",
                  gradient: "from-orange-400 to-yellow-500",
                  delay: 0.2,
                },
                {
                  icon: Database,
                  title: "Multi-Source Cultivation",
                  description: "Data from Google Books, OpenLibrary, WorldCat, and 9+ other gardens.",
                  gradient: "from-red-500 to-pink-500",
                  delay: 0.3,
                },
                {
                  icon: Zap,
                  title: "Lightning Growth",
                  description: "Average response time under 150ms with intelligent root caching.",
                  gradient: "from-yellow-500 to-orange-500",
                  delay: 0.4,
                },
                {
                  icon: Globe,
                  title: "Global Garden",
                  description: "Support for books in 50+ languages from publishers worldwide.",
                  gradient: "from-green-400 to-blue-500",
                  delay: 0.5,
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: feature.delay,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  className="group"
                >
                  <Card className="relative h-full bg-slate-800/40 backdrop-blur-xl border-slate-600/30 hover:border-orange-400/30 transition-all duration-500 overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <CardContent className="p-8 relative z-10">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-full h-full text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-100 group-hover:to-orange-200 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Demo Section with Floral Theme */}
        <motion.section
          id="demo"
          className="relative py-32 px-4 md:px-6 bg-gradient-to-r from-orange-900/10 to-green-900/10 backdrop-blur-sm"
        >
          <div className="container max-w-6xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-16 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <Badge className="bg-gradient-to-r from-green-500/20 to-orange-500/20 border-green-400/30 text-green-200 mb-4">
                      <Star className="w-3 h-3 mr-1" />
                      Live Garden Demo
                    </Badge>
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">Watch Knowledge Bloom</h2>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    See our AI-powered garden system cultivate comprehensive book data in real-time. From classic
                    literature to the latest releases, every book finds its place in our digital garden.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Instant ISBN validation and nurturing",
                    "Multi-source knowledge cultivation",
                    "AI-enhanced content pollination",
                    "Real-time availability flowering",
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                      />
                      <span className="text-slate-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25"
                    >
                      Try Live Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-slate-600/30 text-slate-300 hover:bg-slate-800/50 backdrop-blur-sm bg-transparent"
                    >
                      View Garden Guide
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-3xl blur-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-8 shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-slate-400 text-sm ml-4">ISBN Garden Terminal</span>
                      </div>

                      <div className="space-y-4 font-mono text-sm">
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          whileInView={{ opacity: 1, width: "100%" }}
                          transition={{ delay: 1, duration: 1 }}
                          viewport={{ once: true }}
                          className="text-green-400"
                        >
                          {"> planting ISBN seed: 9780134685991..."}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 2, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="text-orange-400"
                        >
                          {"🌱 Sprouting from Google Books Garden"}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 2.5, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="text-green-400"
                        >
                          {"🌸 Blooming with OpenLibrary nectar"}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 3, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="text-slate-200"
                        >
                          {'📚 "Effective Java" by Joshua Bloch'}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 3.5, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="text-slate-400"
                        >
                          {"⚡ Growth time: 127ms"}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section with Floral Theme */}
        <motion.section
          className="relative py-32 px-4 md:px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="container max-w-4xl mx-auto text-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-100 via-orange-200 to-green-200 bg-clip-text text-transparent"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
              >
                Ready to Grow Your Library?
              </motion.h2>

              <motion.p
                className="text-xl text-slate-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                Join thousands of literary gardeners who trust our platform to cultivate instant, accurate book
                knowledge from the seeds of ISBN numbers.
              </motion.p>

              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-green-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="relative flex gap-3 p-4 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-600/30">
                    <Input
                      type="text"
                      placeholder="Plant your ISBN seed here..."
                      className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-400 focus:ring-0 text-lg"
                    />
                    <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-none shadow-lg shadow-orange-500/25"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Bloom Now
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-wrap justify-center gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {["Free Garden", "No Registration", "Instant Bloom", "Global Seeds"].map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge className="bg-gradient-to-r from-orange-500/20 to-green-500/20 border-orange-400/30 text-orange-200 backdrop-blur-sm px-4 py-2">
                      {badge}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer with Floral Theme */}
      <motion.footer
        className="relative border-t border-slate-600/30 bg-slate-900/60 backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="relative w-8 h-8 mr-3">
                  <Image src="/logo.png" alt="ISBN Book Search Logo" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                    ISBN
                  </span>
                  <span className="text-xs text-slate-400 -mt-1 tracking-wider">BOOK SEARCH</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                The most beautiful ISBN lookup garden for developers, researchers, and book enthusiasts worldwide.
              </p>
            </motion.div>

            {[
              {
                title: "Garden Tools",
                links: ["Features", "API Docs", "Pricing", "Status"],
              },
              {
                title: "Knowledge Seeds",
                links: ["Documentation", "Tutorials", "Blog", "Support"],
              },
              {
                title: "Our Garden",
                links: ["About", "Privacy", "Terms", "Contact"],
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-slate-200 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-slate-400 hover:text-orange-300 text-sm transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="border-t border-slate-600/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 text-sm">
              © 2024 ISBN Book Search. Cultivated with 🌸 for book lovers everywhere.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["GitHub", "Twitter", "Discord"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-slate-400 hover:text-orange-300 text-sm transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
