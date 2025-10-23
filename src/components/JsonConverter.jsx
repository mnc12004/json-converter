import React, { useState } from 'react'
import { validateJson, formatJson, minifyJson, convertToYaml, convertToXml, autoFixJson, extractRevenueCatJson } from '../utils/jsonUtils'
import JsonEditor from './JsonEditor'
import JsonViewer from './JsonViewer'
import JsonVisualizer from './JsonVisualizer'
import { Link } from 'react-router-dom'

const JsonConverter = ({ isDarkMode }) => {
    const [inputJson, setInputJson] = useState('')
    const [outputJson, setOutputJson] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [outputFormat, setOutputFormat] = useState('formatted')
    const [showVisualizer, setShowVisualizer] = useState(false)

    const handleInputChange = (e) => {
        setInputJson(e.target.value)
        setError('')
        setSuccess('')
    }

    const handleFormat = () => {
        try {
            const formatted = formatJson(inputJson)
            setOutputJson(formatted)
            setSuccess('JSON formatted successfully!')
            setError('')
        } catch (err) {
            setError(`Formatting error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleMinify = () => {
        try {
            const minified = minifyJson(inputJson)
            setOutputJson(minified)
            setSuccess('JSON minified successfully!')
            setError('')
        } catch (err) {
            setError(`Minification error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleValidate = () => {
        try {
            const isValid = validateJson(inputJson)
            if (isValid) {
                setSuccess('JSON is valid!')
                setError('')
            } else {
                setError('JSON is invalid!')
                setSuccess('')
            }
        } catch (err) {
            setError(`Validation error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleAutoFix = () => {
        try {
            const fixed = autoFixJson(inputJson)
            setInputJson(fixed)
            setSuccess('JSON auto-fixed successfully!')
            setError('')
        } catch (err) {
            setError(`Auto-fix error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleExtractRevenueCat = () => {
        try {
            const extracted = extractRevenueCatJson(inputJson)
            setInputJson(extracted)
            setSuccess('RevenueCat JSON extracted successfully!')
            setError('')
        } catch (err) {
            setError(`RevenueCat extraction error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleConvert = () => {
        try {
            let converted = ''
            switch (outputFormat) {
                case 'formatted':
                    converted = formatJson(inputJson)
                    break
                case 'minified':
                    converted = minifyJson(inputJson)
                    break
                case 'yaml':
                    converted = convertToYaml(inputJson)
                    break
                case 'xml':
                    converted = convertToXml(inputJson)
                    break
                default:
                    converted = formatJson(inputJson)
            }
            setOutputJson(converted)
            setSuccess(`Converted to ${outputFormat} successfully!`)
            setError('')
        } catch (err) {
            setError(`Conversion error: ${err.message}`)
            setSuccess('')
        }
    }

    const handleClear = () => {
        setInputJson('')
        setOutputJson('')
        setError('')
        setSuccess('')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(outputJson)
        setSuccess('Copied to clipboard!')
        setTimeout(() => setSuccess(''), 2000)
    }

    const handleLoadSample = () => {
        const sampleJson = {
            "name": "John Doe",
            "age": 30,
            "email": "john.doe@example.com",
            "address": {
                "street": "123 Main St",
                "city": "New York",
                "zipCode": "10001"
            },
            "hobbies": ["reading", "swimming", "coding"],
            "isActive": true
        }
        setInputJson(JSON.stringify(sampleJson, null, 2))
        setError('')
        setSuccess('')
    }

    const handleLoadBrokenSample = () => {
        // Sample JSON with common errors that auto-fix can handle
        const brokenJson = `{
            name: "John Doe",  // Missing quotes around key
            age: 30,
            'email': 'john.doe@example.com',  // Single quotes
            address: {
                street: "123 Main St",
                city: "New York",
                zipCode: "10001",
            },  // Trailing comma
            hobbies: ["reading", "swimming", "coding",],  // Trailing comma in array
            isActive: true,
            // This is a comment
            extra: "data"
        }`
        setInputJson(brokenJson)
        setError('')
        setSuccess('')
    }

    const handleLoadRevenueCatSample = () => {
        // Sample RevenueCat webhook JSON with escaped nested JSON
        const revenueCatJson = `{
  "request_body": "{\\"event\\": {\\"event_timestamp_ms\\": 1756814021564, \\"product_id\\": \\"c4c_yearly\\", \\"period_type\\": \\"NORMAL\\", \\"purchased_at_ms\\": 1756814015000, \\"expiration_at_ms\\": 1788350015000, \\"environment\\": \\"PRODUCTION\\", \\"entitlement_id\\": null, \\"entitlement_ids\\": [\\"premium\\"], \\"presented_offering_id\\": \\"The C4C Club Inc Subscriptions\\", \\"transaction_id\\": \\"120003080458374\\", \\"original_transaction_id\\": \\"120003080458374\\", \\"is_family_share\\": false, \\"country_code\\": \\"AU\\", \\"app_user_id\\": \\"oraTldWonxbOnyczP15HiegMVY23\\", \\"aliases\\": [\\"oraTldWonxbOnyczP15HiegMVY23\\"], \\"original_app_user_id\\": \\"oraTldWonxbOnyczP15HiegMVY23\\", \\"currency\\": \\"AUD\\", \\"price\\": 32.778, \\"price_in_purchased_currency\\": 49.99, \\"subscriber_attributes\\": {\\"$attConsentStatus\\": {\\"value\\": \\"authorized\\", \\"updated_at_ms\\": 1756814019753}}, \\"store\\": \\"APP_STORE\\", \\"takehome_percentage\\": 0.7, \\"offer_code\\": null, \\"tax_percentage\\": 0.0909, \\"commission_percentage\\": 0.2727, \\"renewal_number\\": 1, \\"type\\": \\"INITIAL_PURCHASE\\", \\"id\\": \\"03050E65-63D2-4103-9B7D-A593F27740C1\\", \\"app_id\\": \\"app30e71aeddf\\"}, \\"customer_info\\": {\\"original_app_user_id\\": \\"oraTldWonxbOnyczP15HiegMVY23\\", \\"first_seen\\": \\"2025-08-04T20:54:44Z\\", \\"last_seen\\": \\"2025-09-02T11:42:08Z\\", \\"subscriptions\\": {\\"c4c_yearly\\": {\\"purchase_date\\": \\"2025-09-02T11:53:35Z\\", \\"expires_date\\": \\"2026-09-02T11:53:35Z\\", \\"period_type\\": \\"normal\\", \\"original_purchase_date\\": \\"2025-09-02T11:53:36Z\\", \\"store\\": \\"app_store\\", \\"is_sandbox\\": false, \\"unsubscribe_detected_at\\": null, \\"billing_issues_detected_at\\": null, \\"grace_period_expires_date\\": null, \\"refunded_at\\": null, \\"auto_resume_date\\": null, \\"ownership_type\\": \\"PURCHASED\\", \\"display_name\\": null, \\"price\\": {\\"currency\\": \\"AUD\\", \\"amount\\": 49.99}, \\"store_transaction_id\\": \\"120003080458374\\"}}, \\"non_subscriptions\\": {}, \\"other_purchases\\": {}, \\"original_application_version\\": \\"28\\", \\"original_purchase_date\\": \\"2025-09-02T11:53:36Z\\", \\"entitlements\\": {\\"premium\\": {\\"expires_date\\": \\"2026-09-02T11:53:35Z\\", \\"purchase_date\\": \\"2025-09-02T11:53:35Z\\", \\"product_identifier\\": \\"c4c_yearly\\", \\"grace_period_expires_date\\": null}}, \\"management_url\\": \\"https://apps.apple.com/account/subscriptions\\"}, \\"api_version\\": \\"0.1.17\\"}",
  "signed_jws_body": "{\\"token\\": \\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\\"}"
}`
        setInputJson(revenueCatJson)
        setError('')
        setSuccess('')
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Input JSON</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleLoadSample}
                                className="btn-secondary text-sm"
                            >
                                Load Sample
                            </button>
                            <button
                                onClick={handleLoadBrokenSample}
                                className="btn-secondary text-sm bg-red-100 hover:bg-red-200 text-red-800"
                            >
                                Load Broken
                            </button>
                            <button
                                onClick={handleLoadRevenueCatSample}
                                className="btn-secondary text-sm bg-purple-100 hover:bg-purple-200 text-purple-800"
                            >
                                Load RevenueCat
                            </button>
                            <button
                                onClick={handleClear}
                                className="btn-secondary text-sm"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <JsonEditor
                        value={inputJson}
                        onChange={handleInputChange}
                        placeholder="Paste your JSON here..."
                        isDarkMode={isDarkMode}
                        className="h-80"
                    />

                    <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={handleValidate} className="btn-primary">
                            Validate
                        </button>
                        <button onClick={handleAutoFix} className="btn-primary bg-orange-600 hover:bg-orange-700">
                            Auto-Fix
                        </button>
                        <button onClick={handleExtractRevenueCat} className="btn-primary bg-purple-600 hover:bg-purple-700">
                            Extract RevenueCat
                        </button>
                        <button onClick={handleFormat} className="btn-primary">
                            Format
                        </button>
                        <button onClick={handleMinify} className="btn-primary">
                            Minify
                        </button>
                        <button
                            onClick={() => setShowVisualizer(!showVisualizer)}
                            className={`btn-primary ${showVisualizer ? 'bg-green-600 hover:bg-green-700' : 'bg-teal-600 hover:bg-teal-700'}`}
                        >
                            {showVisualizer ? 'Hide Tree' : 'Show Tree'}
                        </button>
                        <Link
                            to="/visualizer"
                            className="btn-primary bg-purple-600 hover:bg-purple-700"
                        >
                            🌳 Full Tree View
                        </Link>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </div>

                {/* Output Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Output</h2>
                        <div className="flex gap-2">
                            <select
                                value={outputFormat}
                                onChange={(e) => setOutputFormat(e.target.value)}
                                className="input-field text-sm py-2 px-3 w-auto dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            >
                                <option value="formatted">Formatted JSON</option>
                                <option value="minified">Minified JSON</option>
                                <option value="yaml">YAML</option>
                                <option value="xml">XML</option>
                            </select>
                            <button
                                onClick={handleConvert}
                                className="btn-primary text-sm"
                            >
                                Convert
                            </button>
                            {outputJson && (
                                <button
                                    onClick={handleCopy}
                                    className="btn-secondary text-sm"
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>

                    <JsonViewer
                        json={outputJson}
                        isDarkMode={isDarkMode}
                        className="h-80"
                    />
                </div>

                {/* JSON Tree Visualizer */}
                {showVisualizer && (
                    <div className="mt-8">
                        <JsonVisualizer
                            jsonData={(() => {
                                try {
                                    return outputJson ? JSON.parse(outputJson) : null
                                } catch {
                                    return null
                                }
                            })()}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="text-2xl mb-2">✓</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">JSON Validation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Validate JSON syntax</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                        <div className="text-2xl mb-2">🔧</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Auto-Fix</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fix common JSON errors</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <div className="text-2xl mb-2">📤</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">RevenueCat</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Extract nested JSON</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <div className="text-2xl mb-2">🎨</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Formatting</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pretty print JSON</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl mb-2">📦</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Minification</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Compress JSON</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <div className="text-2xl mb-2">🔄</div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Conversion</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Convert to YAML/XML</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default JsonConverter
