import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {

  return (
    <header className="sticky top-0 z-50 w-full bg-[#97ff17]">
      <div className="flex h-16 px-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-black">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="" />
          <span className="text-xl font-bold">StockVision <span>AI</span></span>
        </Link>
      </div>
    </header>
  )
}
