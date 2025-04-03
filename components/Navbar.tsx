// export default async function Navbar() {
//   return (
//     <>
//       <div className="w-full flex items-center justify-start bg-[#97ff17] text-black px-16 py-[12px] font-medium text-xl">
//         <h1>INFORMATION&apos;S SYSTEM PROJECT - GROUP 14</h1>
//       </div>
//     </>
//   );
// }
"use client"

import React from "react"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function Navbar() {

  return (
    <header className="sticky top-0 z-50 w-full bg-[#97ff17]">
      <div className="container flex h-16 px-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-black">
          <Zap className="h-6 w-6 text-neon-green" />
          <span className="text-xl font-bold">INFORMATION SYSTEM&apos;S PROJECT | GROUP 14</span>
        </Link>
      </div>
    </header>
  )
}
