import { useTheme } from '@/context/helper/useTheme'
import { Moon, Sun } from 'lucide-react'



const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
  return (
        <button
        onClick={() => toggleTheme()}
        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        aria-label="Toggle theme"
        >
        {resolvedTheme === 'light' ? (
            <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
        ) : (
            <Sun className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
        )}
        </button>
  )
}

export default ThemeToggle