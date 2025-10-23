import React, { useState, useRef, useEffect } from 'react'
import JsonHighlighter from './JsonHighlighter'
import JsonGraphVisualizer from './JsonGraphVisualizer'

const JsonTreeViewer = ({ jsonData, isDarkMode, onClose }) => {
  const [inputJson, setInputJson] = useState(jsonData ? JSON.stringify(jsonData, null, 2) : '')
  const [parsedJson, setParsedJson] = useState(jsonData)
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputJson(value)
    setError('')
    
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value)
        setParsedJson(parsed)
      } else {
        setParsedJson(null)
      }
    } catch (err) {
      setParsedJson(null)
      setError('Invalid JSON syntax')
    }
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
      "isActive": true,
      "subscriptions": {
        "premium": {
          "plan": "yearly",
          "price": 99.99,
          "features": ["unlimited", "priority", "analytics"]
        }
      }
    }
    const jsonString = JSON.stringify(sampleJson, null, 2)
    setInputJson(jsonString)
    setParsedJson(sampleJson)
    setError('')
  }

  const handleClear = () => {
    setInputJson('')
    setParsedJson(null)
    setError('')
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)))
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel)
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`w-full h-full max-w-7xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            JSON CRACK
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Raw JSON */}
          <div className={`w-1/3 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex flex-col`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Raw JSON
              </h3>
            </div>
            <div className="flex-1 p-4 relative">
              <textarea
                value={inputJson}
                onChange={handleInputChange}
                placeholder="Paste your JSON here..."
                className={`w-full h-full resize-none font-mono text-sm p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 absolute inset-0`}
                style={{ 
                  lineHeight: '1.5',
                  tabSize: 2,
                  zIndex: 2,
                  background: 'transparent',
                  color: 'transparent',
                  caretColor: isDarkMode ? '#f3f4f6' : '#1f2937'
                }}
              />
              <div className={`w-full h-full font-mono text-sm p-4 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-600' 
                  : 'bg-white border-gray-300'
              } overflow-auto`}
              style={{ 
                lineHeight: '1.5',
                tabSize: 2,
                zIndex: 1
              }}>
                <JsonHighlighter json={inputJson} isDarkMode={isDarkMode} />
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200 p-2 rounded relative z-10">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Graph Visualization */}
          <div className="flex-1 flex flex-col relative">
            {/* Zoom Controls */}
            <div className={`absolute top-4 right-4 z-10 flex gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-2`}>
              <button
                onClick={handleZoomOut}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
              >
                -
              </button>
              <span className={`px-2 py-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
              >
                Reset
              </button>
            </div>

            {/* Graph Container */}
            <div 
              ref={containerRef}
              className="flex-1 overflow-hidden"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <JsonGraphVisualizer
                jsonData={parsedJson}
                isDarkMode={isDarkMode}
                zoom={zoom}
                pan={pan}
                isDragging={isDragging}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonTreeViewer
