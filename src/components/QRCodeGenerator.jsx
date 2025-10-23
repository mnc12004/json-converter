import React, { useState, useRef } from 'react'
import QRCode from 'react-qr-code'

function QRCodeGenerator({ isDarkMode }) {
    const [text, setText] = useState('')
    const [size, setSize] = useState(256)
    const [bgColor, setBgColor] = useState('#ffffff')
    const [fgColor, setFgColor] = useState('#000000')
    const [errorLevel, setErrorLevel] = useState('M')
    const [showDownload, setShowDownload] = useState(false)
    const qrRef = useRef(null)

    const handleTextChange = (e) => {
        setText(e.target.value)
        setShowDownload(e.target.value.length > 0)
    }

    const downloadQRCode = () => {
        if (qrRef.current) {
            const svg = qrRef.current.querySelector('svg')
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg)
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const img = new Image()

                canvas.width = size
                canvas.height = size

                img.onload = () => {
                    ctx.fillStyle = bgColor
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(img, 0, 0)

                    const link = document.createElement('a')
                    link.download = 'qrcode.png'
                    link.href = canvas.toDataURL()
                    link.click()
                }

                img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
            }
        }
    }

    const copyToClipboard = async () => {
        if (qrRef.current) {
            const svg = qrRef.current.querySelector('svg')
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg)
                try {
                    await navigator.clipboard.writeText(svgData)
                    alert('QR Code SVG copied to clipboard!')
                } catch (err) {
                    console.error('Failed to copy: ', err)
                }
            }
        }
    }

    const presetTexts = [
        { label: 'Website URL', value: 'https://example.com' },
        { label: 'Email', value: 'mailto:contact@example.com' },
        { label: 'Phone', value: 'tel:+1234567890' },
        { label: 'SMS', value: 'sms:+1234567890' },
        { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:password123;;' },
        { label: 'Location', value: 'geo:37.7749,-122.4194' },
        { label: 'Bitcoin', value: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        { label: 'Plain Text', value: 'Hello World!' }
    ]

    const errorLevels = [
        { value: 'L', label: 'Low (7%)' },
        { value: 'M', label: 'Medium (15%)' },
        { value: 'Q', label: 'Quartile (25%)' },
        { value: 'H', label: 'High (30%)' }
    ]

    return (
        <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Generate QR codes that never expire. Perfect for URLs, contact info, WiFi credentials, and more.
                        </p>
                    </div>

                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Text or URL to encode
                        </label>
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Enter text, URL, or any data to encode..."
                            className={`w-full h-32 px-4 py-3 rounded-lg border-2 transition-colors duration-200 resize-none ${isDarkMode
                                    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
                                }`}
                        />
                    </div>

                    {/* Preset Templates */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Quick Templates
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {presetTexts.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setText(preset.value)
                                        setShowDownload(true)
                                    }}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${isDarkMode
                                            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customization Options */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Customization</h3>

                        {/* Size */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Size: {size}px
                            </label>
                            <input
                                type="range"
                                min="128"
                                max="512"
                                step="32"
                                value={size}
                                onChange={(e) => setSize(Number.parseInt(e.target.value, 10))}
                                className="w-full"
                            />
                        </div>

                        {/* Error Correction Level */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Error Correction Level
                            </label>
                            <select
                                value={errorLevel}
                                onChange={(e) => setErrorLevel(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-gray-100'
                                        : 'bg-white border-gray-300 text-gray-800'
                                    }`}
                            >
                                {errorLevels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Background Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-10 rounded border"
                                    />
                                    <input
                                        type="text"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                                ? 'bg-gray-800 border-gray-600 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-800'
                                            }`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Foreground Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-12 h-10 rounded border"
                                    />
                                    <input
                                        type="text"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode
                                                ? 'bg-gray-800 border-gray-600 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-800'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Display */}
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div
                            ref={qrRef}
                            className={`p-6 rounded-lg border-2 ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                                }`}
                        >
                            {text ? (
                                <QRCode
                                    value={text}
                                    size={size}
                                    bgColor={bgColor}
                                    fgColor={fgColor}
                                    level={errorLevel}
                                />
                            ) : (
                                <div className={`w-64 h-64 flex items-center justify-center text-gray-500 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📱</div>
                                        <p>Enter text to generate QR code</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {showDownload && (
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={downloadQRCode}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <span>💾</span>
                                Download PNG
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <span>📋</span>
                                Copy SVG
                            </button>
                        </div>
                    )}

                    {/* QR Code Info */}
                    {text && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                            } border`}>
                            <h4 className="font-semibold mb-2">QR Code Information</h4>
                            <div className="text-sm space-y-1">
                                <p><strong>Content:</strong> {text.length > 50 ? text.substring(0, 50) + '...' : text}</p>
                                <p><strong>Size:</strong> {size} × {size} pixels</p>
                                <p><strong>Error Correction:</strong> {errorLevels.find(l => l.value === errorLevel)?.label}</p>
                                <p><strong>Data Length:</strong> {text.length} characters</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QRCodeGenerator
