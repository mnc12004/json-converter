import React, { useState } from 'react'
import {
    dnsLookup,
    comprehensiveDnsLookup,
    pingHost,
    checkSSL,
    portScan,
    validateEmailDomain,
    emailDiagnostics,
    generateEmailConfigs,
    getWhois,
    checkURL
} from '../utils/networkUtils'

const NetworkTools = ({ isDarkMode }) => {
    const [activeTab, setActiveTab] = useState('dns')
    const [results, setResults] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        setError('')
    }

    const handleDnsLookup = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a hostname')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await comprehensiveDnsLookup(inputValue.trim())
            setResults({ dns: result })
        } catch (err) {
            setError(`DNS lookup failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handlePing = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a hostname')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await pingHost(inputValue.trim())
            setResults({ ping: result })
        } catch (err) {
            setError(`Ping failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleSSLCheck = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a hostname')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await checkSSL(inputValue.trim())
            setResults({ ssl: result })
        } catch (err) {
            setError(`SSL check failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handlePortScan = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a hostname')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await portScan(inputValue.trim())
            setResults({ ports: result })
        } catch (err) {
            setError(`Port scan failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleEmailValidation = async () => {
        if (!inputValue.trim()) {
            setError('Please enter an email address')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await validateEmailDomain(inputValue.trim())
            setResults({ email: result })
        } catch (err) {
            setError(`Email validation failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleEmailDiagnostics = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a domain')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await emailDiagnostics(inputValue.trim())
            setResults({ emailDiagnostics: result })
        } catch (err) {
            setError(`Email diagnostics failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleWhois = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a domain')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await getWhois(inputValue.trim())
            setResults({ whois: result })
        } catch (err) {
            setError(`WHOIS lookup failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleURLCheck = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a URL')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await checkURL(inputValue.trim())
            setResults({ url: result })
        } catch (err) {
            setError(`URL check failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const renderDnsResults = () => {
        const dnsResults = results.dns
        if (!dnsResults) return null

        return (
            <div className="space-y-4">
                {Object.entries(dnsResults).map(([recordType, result]) => (
                    <div key={recordType} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {recordType} Records
                        </h4>
                        {result.error ? (
                            <p className="text-red-600 dark:text-red-400 text-sm">{result.error}</p>
                        ) : result.answers && result.answers.length > 0 ? (
                            <div className="space-y-1">
                                {result.answers.map((answer, index) => (
                                    <div key={index} className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                        <span className="text-gray-600 dark:text-gray-300">TTL:</span>
                                        <span className="text-gray-800 dark:text-gray-100 ml-1">{answer.TTL}</span> |
                                        <span className="text-gray-600 dark:text-gray-300 ml-2">Data:</span>
                                        <span className="text-gray-800 dark:text-gray-100 ml-1">{answer.data}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">No {recordType} records found</p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const renderPingResults = () => {
        const pingResult = results.ping
        if (!pingResult) return null

        return (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${pingResult.reachable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        {pingResult.hostname}
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`ml-2 ${pingResult.reachable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {pingResult.reachable ? 'Reachable' : 'Unreachable'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                        <span className="ml-2 text-gray-800 dark:text-gray-200">{pingResult.responseTime}ms</span>
                    </div>
                </div>
                {pingResult.error && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">{pingResult.error}</p>
                )}
            </div>
        )
    }

    const renderSSLResults = () => {
        const sslResult = results.ssl
        if (!sslResult) return null

        return (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    SSL Certificate - {sslResult.hostname}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                        <span className={`ml-2 font-bold ${sslResult.grade === 'A+' ? 'text-green-600 dark:text-green-400' :
                            sslResult.grade === 'A' ? 'text-green-600 dark:text-green-400' :
                                sslResult.grade === 'B' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                            }`}>
                            {sslResult.grade || 'N/A'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className="ml-2 text-gray-800 dark:text-gray-200">{sslResult.status}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderPortResults = () => {
        const portResult = results.ports
        if (!portResult) return null

        return (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Port Scan - {portResult.hostname}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {portResult.ports.map((port, index) => (
                        <div key={index} className={`p-2 rounded text-sm ${port.isOpen
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            }`}>
                            <div className="font-mono">
                                {port.port} ({port.service})
                            </div>
                            <div className="text-xs">
                                {port.isOpen ? 'Open' : 'Closed'}
                                {port.responseTime && ` - ${port.responseTime}ms`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderEmailResults = () => {
        const emailResult = results.email
        if (!emailResult) return null

        return (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${emailResult.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        Email Validation - {emailResult.email}
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Domain:</span>
                        <span className="ml-2 text-gray-800 dark:text-gray-200">{emailResult.domain}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Has MX Records:</span>
                        <span className={`ml-2 ${emailResult.hasMX ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {emailResult.hasMX ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
                {emailResult.mxRecords.length > 0 && (
                    <div className="mt-3">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">MX Records:</span>
                        <div className="mt-1 space-y-1">
                            {emailResult.mxRecords.map((record, index) => (
                                <div key={index} className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                    Priority: {record.data.split(' ')[0]} | {record.data.split(' ')[1]}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const tabs = [
        { id: 'dns', label: 'DNS Lookup', icon: '🌐' },
        { id: 'ping', label: 'Ping', icon: '📡' },
        { id: 'ssl', label: 'SSL Check', icon: '🔒' },
        { id: 'ports', label: 'Port Scan', icon: '🔍' },
        { id: 'email', label: 'Email Validation', icon: '📧' },
        { id: 'emailDiagnostics', label: 'Email Diagnostics', icon: '🔧' },
        { id: 'whois', label: 'WHOIS', icon: '📋' },
        { id: 'url', label: 'URL Check', icon: '🔗' }
    ]

    const getPlaceholder = () => {
        switch (activeTab) {
            case 'dns':
            case 'ping':
            case 'ssl':
            case 'ports':
                return 'Enter hostname (e.g., google.com)'
            case 'email':
                return 'Enter email address (e.g., user@example.com)'
            case 'emailDiagnostics':
                return 'Enter domain (e.g., example.com)'
            case 'whois':
                return 'Enter domain (e.g., example.com)'
            case 'url':
                return 'Enter URL (e.g., https://example.com)'
            default:
                return 'Enter hostname or domain'
        }
    }

    const handleAction = () => {
        switch (activeTab) {
            case 'dns':
                handleDnsLookup()
                break
            case 'ping':
                handlePing()
                break
            case 'ssl':
                handleSSLCheck()
                break
            case 'ports':
                handlePortScan()
                break
            case 'email':
                handleEmailValidation()
                break
            case 'emailDiagnostics':
                handleEmailDiagnostics()
                break
            case 'whois':
                handleWhois()
                break
            case 'url':
                handleURLCheck()
                break
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Input Section */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={getPlaceholder()}
                        className="flex-1 input-field"
                        disabled={loading}
                    />
                    <button
                        onClick={handleAction}
                        disabled={loading || !inputValue.trim()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Checking...' : 'Check'}
                    </button>
                </div>

                {error && (
                    <div className="error-message mt-2">{error}</div>
                )}
            </div>

            {/* Results Section */}
            {Object.keys(results).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Results
                    </h3>

                    {activeTab === 'dns' && renderDnsResults()}
                    {activeTab === 'ping' && renderPingResults()}
                    {activeTab === 'ssl' && renderSSLResults()}
                    {activeTab === 'ports' && renderPortResults()}
                    {activeTab === 'email' && renderEmailResults()}
                    {activeTab === 'emailDiagnostics' && results.emailDiagnostics && (
                        <div className="space-y-4">
                            {/* Health Score */}
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                        Email Health Score
                                    </h4>
                                    <div className={`text-2xl font-bold ${results.emailDiagnostics.healthScore >= 75 ? 'text-green-600 dark:text-green-400' :
                                        results.emailDiagnostics.healthScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-red-600 dark:text-red-400'
                                        }`}>
                                        {results.emailDiagnostics.healthScore}%
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${results.emailDiagnostics.healthScore >= 75 ? 'bg-green-500' :
                                            results.emailDiagnostics.healthScore >= 50 ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}
                                        style={{ width: `${results.emailDiagnostics.healthScore}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Issues */}
                            {results.emailDiagnostics.issues.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                        Issues Found
                                    </h4>
                                    <ul className="space-y-1">
                                        {results.emailDiagnostics.issues.map((issue, index) => (
                                            <li key={index} className="text-sm text-red-700 dark:text-red-300">
                                                • {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {results.emailDiagnostics.recommendations.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                        Recommendations
                                    </h4>
                                    <ul className="space-y-1">
                                        {results.emailDiagnostics.recommendations.map((rec, index) => (
                                            <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                                                • {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* MX Records */}
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    MX Records
                                </h4>
                                {results.emailDiagnostics.mx.hasRecords ? (
                                    <div className="space-y-1">
                                        {results.emailDiagnostics.mx.records.map((record, index) => (
                                            <div key={index} className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                                <span className="text-gray-600 dark:text-gray-300">Priority:</span>
                                                <span className="text-gray-800 dark:text-gray-100 ml-1">{record.data.split(' ')[0]}</span> |
                                                <span className="text-gray-600 dark:text-gray-300 ml-2">Server:</span>
                                                <span className="text-gray-800 dark:text-gray-100 ml-1">{record.data.split(' ')[1]}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-red-600 dark:text-red-400 text-sm">No MX records found</p>
                                )}
                            </div>

                            {/* SPF Record */}
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    SPF Record
                                </h4>
                                {results.emailDiagnostics.spf.hasRecords ? (
                                    <div className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                        <span className="text-gray-800 dark:text-gray-100">{results.emailDiagnostics.spf.records[0].data}</span>
                                    </div>
                                ) : (
                                    <p className="text-red-600 dark:text-red-400 text-sm">No SPF record found</p>
                                )}
                            </div>

                            {/* DMARC Record */}
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    DMARC Record
                                </h4>
                                {results.emailDiagnostics.dmarc.hasRecords ? (
                                    <div className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                        <span className="text-gray-800 dark:text-gray-100">{results.emailDiagnostics.dmarc.records[0].data}</span>
                                    </div>
                                ) : (
                                    <p className="text-red-600 dark:text-red-400 text-sm">No DMARC record found</p>
                                )}
                            </div>

                            {/* DKIM Records */}
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    DKIM Records
                                </h4>
                                {results.emailDiagnostics.dkim.hasRecords ? (
                                    <div className="space-y-2">
                                        {results.emailDiagnostics.dkim.selectors.map((selector, index) => (
                                            <div key={index}>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Selector: {selector.selector}
                                                </div>
                                                <div className="text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded">
                                                    <span className="text-gray-800 dark:text-gray-100">{selector.records[0].data}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-red-600 dark:text-red-400 text-sm">No DKIM records found</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'whois' && results.whois && (
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                WHOIS - {results.whois.domain}
                            </h4>
                            <pre className="text-sm font-mono bg-white dark:bg-gray-800 p-3 rounded overflow-auto">
                                {JSON.stringify(results.whois.whois, null, 2)}
                            </pre>
                        </div>
                    )}
                    {activeTab === 'url' && results.url && (
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-3 h-3 rounded-full ${results.url.accessible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                    URL Check - {results.url.url}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Accessible:</span>
                                    <span className={`ml-2 ${results.url.accessible ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {results.url.accessible ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                                    <span className="ml-2 text-gray-800 dark:text-gray-200">{results.url.responseTime}ms</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NetworkTools
