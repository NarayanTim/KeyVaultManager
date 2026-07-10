import { PricingTable } from '@clerk/react'
import React from 'react'

const Pricing = () => {
  return (
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50 dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Free forever for small projects. Upgrade when you need more.
            </p>
              </div>
              <PricingTable />
          </div>
          </section>

  )
}

export default Pricing