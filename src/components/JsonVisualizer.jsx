import React, { useState } from 'react'

const JsonVisualizer = ({ jsonData, isDarkMode, fullScreen = false }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set())
    const [copiedPath, setCopiedPath] = useState(null)

    const toggleNode = (path) => {
        const newExpanded = new Set(expandedNodes)
        if (newExpanded.has(path)) {
            newExpanded.delete(path)
        } else {
            newExpanded.add(path)
        }
        setExpandedNodes(newExpanded)
    }

    const copyToClipboard = async (text, path) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedPath(path)
            setTimeout(() => setCopiedPath(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getValueType = (value) => {
        if (value === null) return 'null'
        if (Array.isArray(value)) return 'array'
        if (typeof value === 'object') return 'object'
        return typeof value
    }

    const getNodeColor = (value, isDarkMode) => {
        const type = getValueType(value)
        if (type === 'object' || type === 'array') {
            return isDarkMode ? 'bg-green-500' : 'bg-green-600'
        }
        return isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
    }

    const getValueColor = (value, isDarkMode) => {
        const type = getValueType(value)
        const colors = {
            light: {
                string: 'text-green-600',
                number: 'text-blue-600',
                boolean: 'text-purple-600',
                null: 'text-gray-500',
                object: 'text-gray-700',
                array: 'text-orange-600'
            },
            dark: {
                string: 'text-green-400',
                number: 'text-blue-400',
                boolean: 'text-purple-400',
                null: 'text-gray-400',
                object: 'text-gray-300',
                array: 'text-orange-400'
            }
        }
        return colors[isDarkMode ? 'dark' : 'light'][type]
    }

    const renderTreeNode = (value, path, key, depth = 0) => {
        const type = getValueType(value)
        const isExpanded = expandedNodes.has(path)
        const isComplex = type === 'object' || type === 'array'
        const isEmpty = isComplex && (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0)

        return (
            <div key={path} className="relative mb-4">
                {/* Node Container */}
                <div className="flex items-center">
                {/* Tree Structure Lines */}
                <div className="flex items-center mr-8">
                    {depth > 0 && (
                        <div className="flex items-center">
                            {/* Vertical lines for each depth level */}
                            {Array.from({ length: depth }).map((_, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="w-20 h-20 flex items-center justify-center">
                                        <div className="w-1 h-20 bg-gray-400 dark:bg-gray-500"></div>
                                    </div>
                                </div>
                            ))}
                            {/* Horizontal connector */}
                            <div className="flex items-center">
                                <div className="w-10 h-1 bg-gray-400 dark:bg-gray-500"></div>
                                <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500"></div>
                            </div>
                        </div>
                    )}
                </div>

                    {/* Rectangular Node */}
                    <div className={`min-w-[200px] max-w-[300px] ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                        onClick={() => isComplex && !isEmpty && toggleNode(path)}>

                        {/* Node Header */}
                        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    {key}
                                </span>
                                {isComplex && !isEmpty && (
                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        {isExpanded ? '▼' : '▶'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Node Content */}
                        <div className="px-4 py-3">
                            {!isComplex ? (
                                // Primitive value
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${getValueColor(value, isDarkMode)}`}>
                                        {type === 'string' ? `"${value}"` : String(value)}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            copyToClipboard(String(value), path)
                                        }}
                                        className={`text-xs px-2 py-1 rounded transition-colors ${copiedPath === path
                                                ? 'bg-green-500 text-white'
                                                : isDarkMode
                                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                            }`}
                                    >
                                        {copiedPath === path ? '✓' : 'Copy'}
                                    </button>
                                </div>
                            ) : (
                                // Complex type
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {type === 'array' ? `${value.length} items` : `${Object.keys(value).length} properties`}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                copyToClipboard(JSON.stringify(value, null, 2), path)
                                            }}
                                            className={`text-xs px-2 py-1 rounded transition-colors ${copiedPath === path
                                                    ? 'bg-green-500 text-white'
                                                    : isDarkMode
                                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                                                }`}
                                        >
                                            {copiedPath === path ? '✓' : 'Copy'}
                                        </button>
                                    </div>

                                    {/* Show first few items for collapsed nodes */}
                                    {!isExpanded && !isEmpty && (
                                        <div className="space-y-1">
                                            {type === 'object' ? (
                                                Object.keys(value).slice(0, 3).map((childKey, index) => (
                                                    <div key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {childKey}: {getValueType(value[childKey])}
                                                    </div>
                                                ))
                                            ) : (
                                                value.slice(0, 3).map((item, index) => (
                                                    <div key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        [{index}]: {getValueType(item)}
                                                    </div>
                                                ))
                                            )}
                                            {(type === 'object' ? Object.keys(value).length : value.length) > 3 && (
                                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    ... and {(type === 'object' ? Object.keys(value).length : value.length) - 3} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Children Container - Horizontal Layout */}
                {isExpanded && !isEmpty && (
                    <div className="ml-24 mt-4">
                        <div className="flex flex-wrap gap-4">
                            {type === 'object' && Object.keys(value).map((childKey, index) => (
                                <div key={`${path}.${childKey}`}>
                                    {renderTreeNode(value[childKey], `${path}.${childKey}`, childKey, depth + 1)}
                                </div>
                            ))}
                            {type === 'array' && value.map((item, index) => (
                                <div key={`${path}[${index}]`}>
                                    {renderTreeNode(item, `${path}[${index}]`, `[${index}]`, depth + 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const expandAll = () => {
        const allPaths = new Set()
        const findPaths = (obj, path = '') => {
            if (typeof obj === 'object' && obj !== null) {
                if (Array.isArray(obj)) {
                    obj.forEach((item, index) => {
                        const newPath = `${path}[${index}]`
                        allPaths.add(newPath)
                        findPaths(item, newPath)
                    })
                } else {
                    Object.keys(obj).forEach(key => {
                        const newPath = path ? `${path}.${key}` : key
                        allPaths.add(newPath)
                        findPaths(obj[key], newPath)
                    })
                }
            }
        }
        findPaths(jsonData)
        setExpandedNodes(allPaths)
    }

    const collapseAll = () => {
        setExpandedNodes(new Set())
    }

    if (!jsonData) {
        return (
            <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No JSON data to visualize
            </div>
        )
    }

  if (fullScreen) {
    return (
      <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-auto`}
           style={{
             backgroundImage: isDarkMode 
               ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`
               : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
             backgroundSize: '20px 20px'
           }}>
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              🌳 Tree Visualization
            </h3>
            <div className="flex gap-3">
              <button
                onClick={expandAll}
                className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-sm px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Collapse All
              </button>
            </div>
          </div>
          
          <div className="w-full">
            {renderTreeNode(jsonData, 'root', 'ROOT', 0)}
          </div>
          
          <div className={`mt-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
                <span className="font-medium">Objects & Arrays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>
                <span className="font-medium">Primitive Values</span>
              </div>
            </div>
            <div className="mt-2 text-sm">
              💡 Click nodes to expand/collapse • Click Copy to copy values
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6 shadow-xl`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          🌳 JSON Tree Visualizer
        </h3>
        <div className="flex gap-3">
          <button
            onClick={expandAll}
            className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-sm px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Collapse All
          </button>
        </div>
      </div>
      
      <div className={`h-[50vh] overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-6 border-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-inner relative`}
           style={{
             backgroundImage: isDarkMode 
               ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`
               : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
             backgroundSize: '20px 20px'
           }}>
        {renderTreeNode(jsonData, 'root', 'ROOT', 0)}
      </div>
      
      <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
            <span className="font-medium">Objects & Arrays</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>
            <span className="font-medium">Primitive Values</span>
          </div>
        </div>
        <div className="mt-2 text-sm">
          💡 Click colored circles to expand/collapse • Click Copy to copy values
        </div>
      </div>
    </div>
  )
}

export default JsonVisualizer
