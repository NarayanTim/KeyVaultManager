import React from 'react'

const CodePreview = ({codeExample}:{codeExample:string}) => {
  return (
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-secondary-900 dark:bg-secondary-950 rounded-xl border border-secondary-800 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-secondary-800">
                <div className="w-3 h-3 rounded-full bg-error-500" />
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span className="ml-2 text-sm text-secondary-500">terminal</span>
              </div>
              <pre className="p-6 text-sm text-secondary-300 overflow-x-auto font-mono">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
  )
}

export default CodePreview