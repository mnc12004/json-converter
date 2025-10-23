import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { testDownloadSpeed, testUploadSpeed } from '../utils/networkUtils'

const SpeedTest = ({ isDarkMode }) => {
    const [isTestingDownload, setIsTestingDownload] = useState(false)
    const [isTestingUpload, setIsTestingUpload] = useState(false)
    const [downloadSpeed, setDownloadSpeed] = useState(0)
    const [uploadSpeed, setUploadSpeed] = useState(0)
    const [currentSpeed, setCurrentSpeed] = useState(0)
    const [maxSpeed, setMaxSpeed] = useState(100) // Mbps
    const [testProgress, setTestProgress] = useState(0)
    const [testStatus, setTestStatus] = useState('idle')
    const [history, setHistory] = useState([])
    const animationFrameRef = useRef(null)

    // Smooth animation for speedometer needle
    useEffect(() => {
        const getTargetSpeed = () => {
            if (isTestingDownload) return downloadSpeed
            if (isTestingUpload) return uploadSpeed
            return 0
        }

        const animate = () => {
            setCurrentSpeed(prev => {
                const target = getTargetSpeed()
                const diff = target - prev
                const step = diff * 0.1 // Smooth easing
                return Math.abs(step) < 0.1 ? target : prev + step
            })
            animationFrameRef.current = requestAnimationFrame(animate)
        }
        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [downloadSpeed, uploadSpeed, isTestingDownload, isTestingUpload])

    const handleDownloadTest = async () => {
        setIsTestingDownload(true)
        setDownloadSpeed(0)
        setTestProgress(0)
        setTestStatus('Preparing download test...')

        try {
            const result = await testDownloadSpeed((speed, progress) => {
                setDownloadSpeed(speed)
                setTestProgress(progress)
                setTestStatus(`Testing download: ${speed.toFixed(2)} Mbps`)

                // Adjust max scale if needed
                if (speed > maxSpeed * 0.8) {
                    setMaxSpeed(Math.ceil(speed * 1.5))
                }
            })

            setTestStatus(`Download complete: ${result.speed.toFixed(2)} Mbps`)

            // Add to history
            setHistory(prev => [{
                type: 'download',
                speed: result.speed,
                timestamp: new Date().toISOString(),
                duration: result.duration
            }, ...prev].slice(0, 10))
        } catch (error) {
            setTestStatus(`Download test failed: ${error.message}`)
        } finally {
            setIsTestingDownload(false)
            setTestProgress(0)
        }
    }

    const handleUploadTest = async () => {
        setIsTestingUpload(true)
        setUploadSpeed(0)
        setTestProgress(0)
        setTestStatus('Preparing upload test...')

        try {
            const result = await testUploadSpeed((speed, progress) => {
                setUploadSpeed(speed)
                setTestProgress(progress)
                setTestStatus(`Testing upload: ${speed.toFixed(2)} Mbps`)

                // Adjust max scale if needed
                if (speed > maxSpeed * 0.8) {
                    setMaxSpeed(Math.ceil(speed * 1.5))
                }
            })

            setTestStatus(`Upload complete: ${result.speed.toFixed(2)} Mbps`)

            // Add to history
            setHistory(prev => [{
                type: 'upload',
                speed: result.speed,
                timestamp: new Date().toISOString(),
                duration: result.duration
            }, ...prev].slice(0, 10))
        } catch (error) {
            setTestStatus(`Upload test failed: ${error.message}`)
        } finally {
            setIsTestingUpload(false)
            setTestProgress(0)
        }
    }

    const handleFullTest = async () => {
        await handleDownloadTest()
        await new Promise(resolve => setTimeout(resolve, 1000)) // Brief pause
        await handleUploadTest()
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Main Speedometer Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-2xl p-8">
                <div className="flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Internet Speed Test</h2>

                    {/* Speedometer Gauge */}
                    <Speedometer
                        speed={currentSpeed}
                        maxSpeed={maxSpeed}
                        isActive={isTestingDownload || isTestingUpload}
                        isDarkMode={isDarkMode}
                    />

                    {/* Speed Display */}
                    <div className="text-center mt-6 mb-8">
                        <div className="text-7xl font-bold text-white drop-shadow-lg">
                            {currentSpeed.toFixed(1)}
                        </div>
                        <div className="text-2xl text-white/90 mt-2">Mbps</div>
                    </div>

                    {/* Status */}
                    {testStatus !== 'idle' && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 mb-6">
                            <p className="text-white text-sm font-medium">{testStatus}</p>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {(isTestingDownload || isTestingUpload) && (
                        <div className="w-full max-w-md mb-6">
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${testProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Test Buttons */}
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button
                            onClick={handleDownloadTest}
                            disabled={isTestingDownload || isTestingUpload}
                            className="bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {isTestingDownload ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Testing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    ⬇️ Test Download
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleUploadTest}
                            disabled={isTestingDownload || isTestingUpload}
                            className="bg-white text-purple-600 hover:bg-purple-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            {isTestingUpload ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Testing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    ⬆️ Test Upload
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleFullTest}
                            disabled={isTestingDownload || isTestingUpload}
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            <span className="flex items-center gap-2">
                                🚀 Full Test
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Download Result */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⬇️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Download Speed</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Latest test result</p>
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {downloadSpeed.toFixed(2)} <span className="text-xl text-gray-500">Mbps</span>
                    </div>
                </div>

                {/* Upload Result */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <span className="text-2xl">⬆️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Upload Speed</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Latest test result</p>
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {uploadSpeed.toFixed(2)} <span className="text-xl text-gray-500">Mbps</span>
                    </div>
                </div>
            </div>

            {/* Test History */}
            {history.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Test History</h3>
                    <div className="space-y-3">
                        {history.map((test) => (
                            <div
                                key={test.timestamp}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {test.type === 'download' ? '⬇️' : '⬆️'}
                                    </span>
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                            {test.type}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(test.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${test.type === 'download'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-purple-600 dark:text-purple-400'
                                        }`}>
                                        {test.speed.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-500">Mbps</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Speedometer Gauge Component
const Speedometer = ({ speed, maxSpeed, isActive }) => {
    const size = 320
    const centerX = size / 2
    const centerY = size / 2
    const radius = 120
    const strokeWidth = 30

    // Calculate angle for needle (-135° to 135°, 270° total)
    const minAngle = -135
    const maxAngle = 135
    const speedRatio = Math.min(speed / maxSpeed, 1)
    const needleAngle = minAngle + (speedRatio * (maxAngle - minAngle))

    // Create gradient segments
    const segments = 270 // Total degrees
    const segmentCount = 50

    const getColorForSegment = (index) => {
        const ratio = index / segmentCount
        if (ratio < 0.33) return '#ef4444' // Red
        if (ratio < 0.66) return '#eab308' // Yellow
        return '#22c55e' // Green
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
            {/* Glow effect */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
            </defs>

            {/* Background circle */}
            <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${(segments / 360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}`}
                strokeDashoffset={-(Math.PI * radius * 0.25)}
                transform={`rotate(-135 ${centerX} ${centerY})`}
            />

            {/* Colored segments */}
            {Array.from({ length: segmentCount }).map((_, index) => {
                const startAngle = minAngle + (index / segmentCount) * segments
                const angle = segments / segmentCount
                const circumference = 2 * Math.PI * radius
                const segmentLength = (angle / 360) * circumference
                const offset = -((startAngle + 135) / 360) * circumference

                const opacity = speedRatio >= (index / segmentCount) ? 1 : 0.2

                return (
                    <circle
                        key={`segment-${startAngle}`}
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        fill="none"
                        stroke={getColorForSegment(index)}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${segmentLength} ${circumference}`}
                        strokeDashoffset={offset}
                        opacity={opacity}
                        className="transition-opacity duration-300"
                        filter={isActive && opacity === 1 ? "url(#glow)" : ""}
                    />
                )
            })}

            {/* Speed markers */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const angle = minAngle + (ratio * segments)
                const radian = (angle * Math.PI) / 180
                const x1 = centerX + (radius - strokeWidth / 2 - 10) * Math.cos(radian)
                const y1 = centerY + (radius - strokeWidth / 2 - 10) * Math.sin(radian)
                const x2 = centerX + (radius - strokeWidth / 2 - 20) * Math.cos(radian)
                const y2 = centerY + (radius - strokeWidth / 2 - 20) * Math.sin(radian)

                const labelX = centerX + (radius - strokeWidth / 2 - 40) * Math.cos(radian)
                const labelY = centerY + (radius - strokeWidth / 2 - 40) * Math.sin(radian)

                return (
                    <g key={`marker-${ratio}`}>
                        <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <text
                            x={labelX}
                            y={labelY}
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {Math.round(maxSpeed * ratio)}
                        </text>
                    </g>
                )
            })}

            {/* Center hub */}
            <circle
                cx={centerX}
                cy={centerY}
                r={15}
                fill="white"
                filter="url(#glow)"
            />

            {/* Needle */}
            <g transform={`rotate(${needleAngle} ${centerX} ${centerY})`}>
                <polygon
                    points={`${centerX},${centerY - 8} ${centerX + radius - strokeWidth / 2 - 15},${centerY} ${centerX},${centerY + 8}`}
                    fill="white"
                    filter="url(#glow)"
                    className="transition-transform duration-100"
                />
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={10}
                    fill="white"
                />
            </g>

            {/* Center dot */}
            <circle
                cx={centerX}
                cy={centerY}
                r={6}
                fill="#3b82f6"
            />
        </svg>
    )
}

SpeedTest.propTypes = {
    isDarkMode: PropTypes.bool.isRequired
}

Speedometer.propTypes = {
    speed: PropTypes.number.isRequired,
    maxSpeed: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired
}

export default SpeedTest

