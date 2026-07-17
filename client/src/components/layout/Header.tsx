import React from 'react'
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { Link } from 'react-router-dom';
import {Key} from 'lucide-react';
import { SignInButton, SignUpButton, Show, SignOutButton} from '@clerk/react'
import { useNavigate } from "react-router-dom";




const Header = () => {
  const navigate = useNavigate();

  const handleToDashboard = () => {
    navigate("/dashboard")
  }

    return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-secondary-950/80 backdrop-blur-lg border-b border-secondary-200 dark:border-secondary-800">
            
  {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-secondary-950/80 backdrop-blur-lg border-b border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">EnvKey</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors">
                Pricing
              </a>
              <Link to="/documentation" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors">
                Documentation
              </Link>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Show when={"signed-in"}>

                  <Button onClick={handleToDashboard} variant="primary" size="sm">Dashboard</Button>

                <SignOutButton>
                  <Button variant="danger" size="sm">Logout</Button>
                </SignOutButton>
                </Show>
              <Show when={"signed-out"}>
                  
              <SignInButton mode='modal'>
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              {/* <Link to="/signup">
              </Link> */}
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
              </SignUpButton>
              </Show>
            </div>
          </div>
        </div>
      </nav>
    </header>
    )
}

export default Header