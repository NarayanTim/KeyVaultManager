import { CodePreview, CTAAction, Feature, HowItWorks, Pricing } from "@/components/min/index"

import { Header, Footer } from '@/components/layout/index'
import { Button } from "@/components/ui/index"
import { codeExample, features, threeProcess } from '@/lib'
import { Link } from "react-router-dom"
import React from 'react'
import { ArrowRight, Lock } from "lucide-react"



const Landing = () => {
    return (
        <div className='min-h-screen bg-white dark:bg-secondary-950'>  
            <Header />
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              Trusted by 10,000+ developers
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-secondary-900 dark:text-white mb-6 leading-tight">
              Store Secrets.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-accent-500">
                Ship Faster.
              </span>
            </h1>

            <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-2xl mx-auto">
              The simplest way to manage environment variables and API keys across all your projects. Secure, fast, and developer-friendly.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/documentation">
                <Button variant="secondary" size="lg">
                  View Docs
                </Button>
              </Link>
            </div>
        </div>
                </div>
                <CodePreview codeExample={codeExample} />
                </section>
                <Feature features={features}/>
                <HowItWorks threeProcess={threeProcess} />
            {/* Pricing Section */}
            {/* <PricingTable/>
             */}
            <Pricing/>
                <CTAAction/>
            
            <Footer/>
        </div>
        
    )
}

export default Landing