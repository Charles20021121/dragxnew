"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Search, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import { motion } from "framer-motion"

export default function SearchDrawer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 1) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
          const data = await res.json()
          
          if (!res.ok) {
            console.error('Search API error:', data)
            throw new Error(data.error || 'Search failed')
          }

          console.log('Search results:', data)
          setSearchResults(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    if (window.fbq) {
      window.fbq('track', 'Search', {
        search_string: e.target.value,
        content_category: 'Product Search'
      });
    }
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
  }

  const handleResultClick = (result) => {
    setIsOpen(false)
    clearSearch()
    
    if (!result) {
      console.error('Invalid result:', result)
      return
    }

    if (result.type === 'gallery') {
      router.push(result.domainUrl)
    } else {
      const slug = result.Name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      router.push(`/products/${result.categories}/${slug}`)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
          <Search className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="top" 
        className="w-full bg-[#1c1c1c] border-b border-white/10 block fixed inset-0 h-full"
      >
        <div className="absolute inset-0 bg-[#1c1c1c]" />
        <div 
          className="relative h-full flex flex-col bg-[#1c1c1c] overflow-hidden"
          style={{ height: '100vh', height: '-webkit-fill-available' }}
        >
          <SheetHeader className="space-y-2.5 px-4 flex-shrink-0 bg-[#1c1c1c] relative z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white text-xl">Search Products</SheetTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Input 
                value={searchTerm}
                onChange={handleSearch}
                type="search" 
                placeholder="Type to search..." 
                className="bg-transparent border-white/20 text-white pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#88bc04] focus:ring-[#88bc04]"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </SheetHeader>

          <div 
            className="flex-1 overflow-y-scroll -webkit-overflow-scrolling-touch px-4 relative z-10 bg-[#1c1c1c]"
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom, 20px)',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {searchTerm && !isLoading && (
              <div className="my-4 text-white/60 text-sm">
                {searchResults.length > 0 ? (
                  <p>Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}</p>
                ) : (
                  <p>No products found for "{searchTerm}"</p>
                )}
              </div>
            )}

            <div className="pb-safe">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#88bc04] border-t-transparent mb-2"></div>
                  <p className="text-white/60 text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.Id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-black/20">
                          {result?.Url ? (
                            <>
                              <CldImage
                                src={result.Url}
                                alt={result.Name || 'Image'}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              />
                              {result.type === 'gallery' && (
                                <div className="absolute top-2 right-2 bg-[#88bc04] text-white text-xs px-2 py-1 rounded-full">
                                  Gallery
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        </div>
                        <h3 className="text-white text-sm font-medium truncate group-hover:text-[#88bc04] transition-colors duration-300">
                          {result?.Name || 'Untitled Product'}
                        </h3>
                        <p className="text-white/40 text-xs truncate">
                          {result?.categories || 'Uncategorized'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 mb-4 text-center text-white/60 text-sm">
                    {searchResults.length === 12 && "Showing first 12 results"}
                  </div>
                </>
              ) : searchTerm && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-white/60 text-center">
                    <p className="text-lg mb-2">No results found</p>
                    <p className="text-sm">Try different keywords or check the spelling</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 