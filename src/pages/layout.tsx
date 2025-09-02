import React from "react"

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <div className="antialiased">{children}</div>
}
