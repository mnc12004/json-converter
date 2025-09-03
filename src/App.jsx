import React, { useState } from 'react'
import JsonConverter from './components/JsonConverter'
import NetworkTools from './components/NetworkTools'

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [activeTab, setActiveTab] = useState('json')

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('json')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'json'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>📄</span>
                                JSON Tools
                            </button>
                            <button
                                onClick={() => setActiveTab('network')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'network'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>🌐</span>
                                Network Tools
                            </button>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
                        >
                            {isDarkMode ? (
                                <>
                                    <span className="text-xl">☀️</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl">🌙</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
                                </>
                            )}
                        </button>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        {activeTab === 'json' ? 'JSON Converter' : 'Network Tools'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {activeTab === 'json'
                            ? 'Format, validate, and convert JSON data with ease'
                            : 'DNS lookups, ping, SSL checks, and network diagnostics'
                        }
                    </p>
                </header>

                <main>
                    {activeTab === 'json' && <JsonConverter isDarkMode={isDarkMode} />}
                    {activeTab === 'network' && <NetworkTools isDarkMode={isDarkMode} />}
                </main>

                <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
                    <p>Built with React & TailwindCSS</p>
                </footer>
            </div>
        </div>
    )
}

export default App
