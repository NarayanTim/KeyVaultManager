import React from 'react'

const HowItWorks = ({threeProcess}) => {
  return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Three steps to secure secrets
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {
              
            threeProcess.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-8xl font-bold text-secondary-100 dark:text-secondary-800 absolute top-0 left-0 -z-10">
                  {item.step}
                </div>
                <div className="pt-8 pl-4">
                  <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default HowItWorks