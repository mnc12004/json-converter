import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import JsonConverter from './components/JsonConverter'
import NetworkTools from './components/NetworkTools'
import JsonVisualizerPage from './components/JsonVisualizerPage'
import QRCodeGenerator from './components/QRCodeGenerator'

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true)

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <Router>
            <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </div>
        </Router>
    )
}

function AppContent({ isDarkMode, toggleDarkMode }) {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('json')

    // Update active tab based on current route
    React.useEffect(() => {
        if (location.pathname === '/visualizer') {
            setActiveTab('visualizer')
        } else if (location.pathname === '/network') {
            setActiveTab('network')
        } else if (location.pathname === '/qr') {
            setActiveTab('qr')
        } else {
            setActiveTab('json')
        }
    }, [location.pathname])

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'json'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>📄</span>
                            JSON Tools
                        </Link>
                        <Link
                            to="/visualizer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'visualizer'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>🌳</span>
                            JSON Visualizer
                        </Link>
                        <Link
                            to="/network"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'network'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>🌐</span>
                            Network Tools
                        </Link>
                        <Link
                            to="/qr"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === 'qr'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>📱</span>
                            QR Generator
                        </Link>
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
                    {activeTab === 'json' ? 'JSON Converter' : activeTab === 'visualizer' ? 'JSON Visualizer' : activeTab === 'network' ? 'Network Tools' : 'QR Code Generator'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {activeTab === 'json'
                        ? 'Format, validate, and convert JSON data with ease'
                        : activeTab === 'visualizer'
                            ? 'Interactive JSON tree visualization with draggable nodes'
                            : activeTab === 'network'
                                ? 'DNS lookups, ping, SSL checks, and network diagnostics'
                                : 'Generate QR codes that never expire for URLs, contact info, WiFi, and more'
                    }
                </p>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<JsonConverter isDarkMode={isDarkMode} />} />
                    <Route path="/visualizer" element={<JsonVisualizerPage isDarkMode={isDarkMode} />} />
                    <Route path="/network" element={<NetworkTools isDarkMode={isDarkMode} />} />
                    <Route path="/qr" element={<QRCodeGenerator isDarkMode={isDarkMode} />} />
                </Routes>
            </main>

            <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
                <p>Built with React & TailwindCSS</p>
            </footer>
        </div>
    )
}

export default App