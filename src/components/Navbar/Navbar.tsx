"use client";

import { useState, useRef, useEffect } from "react";
import { LoginModal } from "../Modal";
import { useTheme, useAuth } from "../ThemeProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  console.log("NAVBAR")
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const isHomePage = pathname === "/";

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              </Link>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PersonifAI
              </span>
            </div>

            {isHomePage && (
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Testimonials
                </a>
                <Link href="/tasks" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Task Bucket
                </Link>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Theme Toggle Button - Always visible when not logged in */}
              {!isLoggedIn && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {theme === "dark" ? (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              )}

              {isLoggedIn ? (
                // User Menu (when logged in)
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">U</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">User</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                      </div>

                      {/* Theme Toggle */}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          {theme === "dark" ? (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              Light Mode
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                              Dark Mode
                            </>
                          )}
                        </span>
                        <div className={`w-10 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-indigo-600" : "bg-gray-300"}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${theme === "dark" ? "translate-x-4" : "translate-x-0.5"} mt-0.5`}></div>
                        </div>
                      </button>

                      {/* Dashboard Link */}
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>

                      {/* Divider */}
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Login buttons (when not logged in)
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )
              }
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          login();
        }}
      />
    </>
  );
}
