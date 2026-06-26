"use client";

import { useState } from "react";
import { LoginModal, DemoDialog } from "../Modal";
import { useAuth } from "../ThemeProvider";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              AI-Powered Learning Revolution
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Learn Smarter with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Personalized AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your educational journey with AI that adapts to your learning style. 
              Perfect for school students and college learners seeking academic excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                >
                  Start Learning Free
                </button>
              )}
              <button 
                onClick={() => setIsDemoDialogOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free to Start
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Credit Card
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel Anytime
              </div>
            </div>
          </div>

          {/* Hero Cards */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Tutoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24/7 AI assistance for all subjects</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visual analytics of your growth</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-800 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Curriculum</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tailored to your goals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      <DemoDialog 
        isOpen={isDemoDialogOpen} 
        onClose={() => setIsDemoDialogOpen(false)} 
      />
    </>
  );
}
