import React, { useState } from 'react'
import { JSONTree } from 'react-json-tree'
import JsonHighlighter from './JsonHighlighter'

const JsonTreeViewerSimple = ({ jsonData, isDarkMode, onClose }) => {
  const [inputJson, setInputJson] = useState(jsonData ? JSON.stringify(jsonData, null, 2) : '')
  const [parsedJson, setParsedJson] = useState(jsonData)
  const [error, setError] = useState('')

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

  const theme = {
    scheme: isDarkMode ? 'monokai' : 'bright',
    author: 'monokai',
    base00: isDarkMode ? '#272822' : '#ffffff',
    base01: isDarkMode ? '#383830' : '#f8f8f2',
    base02: isDarkMode ? '#49483e' : '#f4f4ef',
    base03: isDarkMode ? '#75715e' : '#a59f85',
    base04: isDarkMode ? '#a59f85' : '#75715e',
    base05: isDarkMode ? '#f8f8f2' : '#49483e',
    base06: isDarkMode ? '#f5f4f1' : '#383830',
    base07: isDarkMode ? '#f9f8f5' : '#272822',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`w-full h-full max-w-7xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            JSON Tree Viewer
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

          {/* Right Panel - Tree Visualization */}
          <div className="flex-1 flex flex-col">
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Tree Visualization
              </h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {parsedJson ? (
                <JSONTree
                  data={parsedJson}
                  theme={theme}
                  invertTheme={false}
                  shouldExpandNode={(keyPath, data, level) => level < 2}
                  hideRoot={false}
                  getItemString={(type, data, itemType, itemString) => {
                    if (type === 'Object') {
                      return `{${Object.keys(data).length} ${Object.keys(data).length === 1 ? 'property' : 'properties'}}`
                    }
                    if (type === 'Array') {
                      return `[${data.length} ${data.length === 1 ? 'item' : 'items'}]`
                    }
                    return itemString
                  }}
                />
              ) : (
                <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {error ? `Error: ${error}` : 'No JSON data to visualize'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonTreeViewerSimple
