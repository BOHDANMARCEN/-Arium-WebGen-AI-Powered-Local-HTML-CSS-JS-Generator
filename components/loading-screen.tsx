"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [glitchClass, setGlitchClass] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Apply glitch effect at intervals
    const glitchInterval = setInterval(() => {
      setGlitchClass("glitch")
      setTimeout(() => setGlitchClass(""), 200)
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [])

  // Ensure consistent rendering on server and client
  const loadingText = "LOADING, PLEASE WAIT..."

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <h1
        className={`text-4xl md:text-6xl font-bold tracking-wider text-white mb-8 ${glitchClass}`}
        style={{ fontFamily: "'Space Mono', monospace" }}
        suppressHydrationWarning
      >
        {loadingText}
      </h1>

      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
            text-shadow: 0 0 5px #fff;
          }
          20% {
            transform: translate(-2px, 2px);
            text-shadow: 2px 0 5px #fff, -2px 0 5px #fff;
          }
          40% {
            transform: translate(-2px, -2px);
            text-shadow: 2px 0 5px #fff, -2px 0 5px #fff, 0 0 10px #fff;
          }
          60% {
            transform: translate(2px, 2px);
            text-shadow: 2px 0 5px #fff, -2px 0 5px #fff, 0 0 15px #fff;
          }
          80% {
            transform: translate(2px, -2px);
            text-shadow: 2px 0 5px #fff, -2px 0 5px #fff;
          }
          100% {
            transform: translate(0);
            text-shadow: 0 0 5px #fff;
          }
        }

        .glitch {
          animation: glitch 0.3s linear forwards;
        }
      `}</style>
    </div>
  )
}
