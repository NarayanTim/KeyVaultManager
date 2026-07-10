import React from 'react'
import { Badge } from '../ui/index';
import { NavLink, useLocation } from 'react-router-dom';
import { Key, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { navItems } from './NavLinkData';




const Sidebar = () => {
  // const { currentUser, logout} = { {name:"Test"}, "Flase" }
  const currentUser = { name: "test", username: "Test", email: "test", firstName: "T", lastName: "test" }
  const logout = () => {
    console.log("Test")
  }
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-secondary-200 dark:border-secondary-800">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-secondary-900 dark:text-white">EnvKey</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Subscription Badge */}
      <div className="px-4 py-3 mx-3 mb-2 bg-linear-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border border-primary-100 dark:border-primary-800/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
            Current Plan
          </span>
          <Badge variant={'primary'} size="sm">
            {'FREE'}
          </Badge>
        </div>
        {/* {currentUser?.subscription_tier === 'free' && (
          <NavLink
            to="/dashboard#plans"
            className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline mt-2"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade for more features
          </NavLink>
        )} */}
      </div>

      {/* User Section */}
      <div className="border-t border-secondary-200 dark:border-secondary-800 px-3 py-3">
        <div className="flex items-center justify-between">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors flex-1"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-medium text-sm">
              {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                {currentUser?.email || 'User'}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                Manage account
              </p>
            </div>
          </NavLink>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={logout}
              className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-error-600 dark:hover:text-error-400 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar