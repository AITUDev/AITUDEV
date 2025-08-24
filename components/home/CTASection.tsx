"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Journey?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Whether you're a beginner or experienced developer, there's a place for you in our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
            <Link href="/join">
              Join Our Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-slate-900" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
