"use client"

import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CldImage } from 'next-cloudinary'
import SearchDrawer from './SearchDrawer'
import { Outfit } from "next/font/google"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const outfit = Outfit({ subsets: ["latin"] })

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/dx360", label: "DX360" },
  { href: "/powerboot", label: "PowerBoot" },
  { href: "/gallery", label: "Gallery" },
  { href: "/locations", label: "Locations" },
]

const menuVariants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  closed: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3
    }
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (href) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <nav className="w-full bg-[#28242c] text-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link className="navbar-brand" href="/" >
            <CldImage
              priority
              width="150"
              height="48"
              src={'https://res.cloudinary.com/dmkxx68km/image/upload/v1721035647/zvrfokcnqhxqa8crxgoj.webp'}
              sizes="100vw"
              alt={'Logo'}
            />
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <SearchDrawer />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-colors">
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-[#1a1a1a] text-white border-l border-white/10 p-0"
              >
                <SheetHeader className="absolute w-full top-0 left-0">
                  <SheetTitle className="sr-only">
                    Navigation Menu
                  </SheetTitle>
                </SheetHeader>
                <motion.div 
                  className="flex flex-col h-full pt-16 px-6"
                  initial="closed"
                  animate="open"
                  variants={menuVariants}
                >
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      className="py-3"
                    >
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`
                          w-full text-left
                          text-gray-400 text-base font-bold tracking-wide 
                          hover:text-white transition-all duration-300
                          flex items-center group
                          ${outfit.className}
                        `}
                      >
                        <motion.span 
                          className="relative overflow-hidden"
                          whileHover={{ x: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500 ease-out" />
                        </motion.span>
                        <motion.svg 
                          className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`text-gray-400 text-xs font-bold tracking-wide hover:text-gray-200 transition-colors ${outfit.className}`}
              >
                {item.label}
              </Link>
            ))}
            <SearchDrawer />
          </div>
        </div>
      </div>
    </nav>
  )
} 