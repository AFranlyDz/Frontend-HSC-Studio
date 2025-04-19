import { Outlet } from "react-router-dom"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

/**
 * Main layout component that wraps all pages with a consistent header and footer
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
