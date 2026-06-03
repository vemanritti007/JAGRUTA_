import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-[100]",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-3 bg-bg-void/80 border border-glass-border backdrop-blur-lg py-1.5 px-2 rounded-full shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url))

          return (
            <Link
              key={item.name}
              to={item.url}
              className={cn(
                "relative cursor-pointer px-3 sm:px-5 py-1.5 rounded-full transition-colors flex flex-col items-center justify-center gap-0.5",
                "text-text-secondary hover:text-text-primary",
                isActive && "text-green-core",
                item.url === '/compare' && 'tour-nav-compare',
                item.url === '/voting-guide' && 'tour-nav-guide',
                item.url === '/more' && 'tour-nav-more'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-body uppercase text-[9px] tracking-wider leading-none">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-green-deep rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-core rounded-t-full">
                    <div className="absolute w-12 h-6 bg-green-core/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-green-core/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-green-core/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
