import React from 'react'

const Footer = () => {
  return (
 <footer className="border-t border-secondary-200 dark:border-secondary-800 bg-white dark:bg-secondary-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg text-secondary-900 dark:text-white">KeyVault</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-secondary-600 dark:text-secondary-400">
            <a href="#" className="hover:text-secondary-900 dark:hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-secondary-900 dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-secondary-900 dark:hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-secondary-500 dark:text-secondary-500">
          &copy; {new Date().getFullYear()} KeyVault. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer