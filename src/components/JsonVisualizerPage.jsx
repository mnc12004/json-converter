import React, { useState, useRef, useEffect } from 'react'
import JsonHighlighter from './JsonHighlighter'

const JsonVisualizerPage = ({ isDarkMode }) => {
    const [inputJson, setInputJson] = useState('')
    const [parsedJson, setParsedJson] = useState(null)
    const [error, setError] = useState('')
    const [expandedNodes, setExpandedNodes] = useState(new Set())
    const [nodePositions, setNodePositions] = useState(new Map())
    const [draggedNode, setDraggedNode] = useState(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const svgRef = useRef(null)

    // Initialize with sample JSON
    useEffect(() => {
        const sampleJson = {
            "name": "John Doe",
            "age": 30,
            "email": "john.doe@example.com",
            "address": {
                "street": "123 Main St",
                "city": "New York",
                "zipCode": "10001",
                "coordinates": {
                    "lat": 40.7128,
                    "lng": -74.0060
                }
            },
            "hobbies": ["reading", "swimming", "coding"],
            "isActive": true,
            "metadata": {
                "created": "2024-01-01",
                "updated": "2024-01-15",
                "tags": ["user", "premium"]
            }
        }
        setInputJson(JSON.stringify(sampleJson, null, 2))
        setParsedJson(sampleJson)
        initializeNodePositions(sampleJson)
    }, [])

    const initializeNodePositions = (data, path = 'root', x = 100, y = 100) => {
        const positions = new Map()
        positions.set(path, { x, y })

        const processNode = (value, currentPath, currentX, currentY) => {
            if (typeof value === 'object' && value !== null) {
                const keys = Array.isArray(value) ? value.map((_, i) => i) : Object.keys(value)
                keys.forEach((key, index) => {
                    const childPath = Array.isArray(value) ? `${currentPath}[${key}]` : `${currentPath}.${key}`
                    const childX = currentX + 350
                    const childY = currentY + (index * 140)
                    positions.set(childPath, { x: childX, y: childY })

                    if (typeof value[key] === 'object' && value[key] !== null) {
                        processNode(value[key], childPath, childX, childY)
                    }
                })
            }
        }

        processNode(data, path, x, y)
        setNodePositions(positions)
    }

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputJson(value)
        setError('')

        try {
            const parsed = JSON.parse(value)
            setParsedJson(parsed)
            initializeNodePositions(parsed)
        } catch (err) {
            setError(`Invalid JSON: ${err.message}`)
            setParsedJson(null)
        }
    }

    const handleParseJson = () => {
        try {
            const parsed = JSON.parse(inputJson)
            setParsedJson(parsed)
            setError('')
            initializeNodePositions(parsed)
        } catch (err) {
            setError(`Invalid JSON: ${err.message}`)
            setParsedJson(null)
        }
    }

    const handleLoadSample = () => {
        const sampleJson = {
            "user": {
                "id": 12345,
                "profile": {
                    "name": "Alice Johnson",
                    "email": "alice@example.com",
                    "preferences": {
                        "theme": "dark",
                        "notifications": true,
                        "language": "en"
                    }
                },
                "orders": [
                    {
                        "id": "ORD-001",
                        "items": ["laptop", "mouse", "keyboard"],
                        "total": 1299.99
                    },
                    {
                        "id": "ORD-002",
                        "items": ["monitor"],
                        "total": 299.99
                    }
                ],
                "subscription": {
                    "plan": "premium",
                    "status": "active",
                    "renewalDate": "2024-12-31"
                }
            },
            "metadata": {
                "version": "1.0",
                "lastUpdated": "2024-01-15T10:30:00Z"
            }
        }
        setInputJson(JSON.stringify(sampleJson, null, 2))
        setParsedJson(sampleJson)
        initializeNodePositions(sampleJson)
        setError('')
    }

    const handleClear = () => {
        setInputJson('')
        setParsedJson(null)
        setError('')
        setNodePositions(new Map())
        setExpandedNodes(new Set())
    }

    const toggleNode = (path) => {
        const newExpanded = new Set(expandedNodes)
        if (newExpanded.has(path)) {
            newExpanded.delete(path)
        } else {
            newExpanded.add(path)
        }
        setExpandedNodes(newExpanded)
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
            return isDarkMode ? '#10B981' : '#059669' // Green for complex types
        }
        return isDarkMode ? '#3B82F6' : '#2563EB' // Blue for primitives
    }

    const getValueColor = (value, isDarkMode) => {
        const type = getValueType(value)
        const colors = {
            light: {
                string: '#16A34A',
                number: '#2563EB',
                boolean: '#9333EA',
                null: '#6B7280',
                object: '#374151',
                array: '#EA580C'
            },
            dark: {
                string: '#4ADE80',
                number: '#60A5FA',
                boolean: '#A78BFA',
                null: '#9CA3AF',
                object: '#D1D5DB',
                array: '#FB923C'
            }
        }
        return colors[isDarkMode ? 'dark' : 'light'][type]
    }

    const copyValue = (value) => {
        navigator.clipboard.writeText(JSON.stringify(value))
    }

    const handleNodeMouseDown = (e, path) => {
        e.stopPropagation()
        const rect = svgRef.current.getBoundingClientRect()
        const nodePos = nodePositions.get(path)
        setDraggedNode(path)
        setDragOffset({
            x: e.clientX - rect.left - nodePos.x * zoom - pan.x,
            y: e.clientY - rect.top - nodePos.y * zoom - pan.y
        })
    }

    const handleMouseMove = (e) => {
        if (draggedNode) {
            const rect = svgRef.current.getBoundingClientRect()
            const newX = (e.clientX - rect.left - pan.x - dragOffset.x) / zoom
            const newY = (e.clientY - rect.top - pan.y - dragOffset.y) / zoom

            setNodePositions(prev => {
                const newPositions = new Map(prev)
                newPositions.set(draggedNode, { x: newX, y: newY })
                return newPositions
            })
        } else if (isDragging) {
            const deltaX = e.clientX - dragStart.x
            const deltaY = e.clientY - dragStart.y
            setPan(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }))
            setDragStart({ x: e.clientX, y: e.clientY })
        }
    }

    const handleMouseUp = () => {
        setDraggedNode(null)
        setIsDragging(false)
    }

    const handleMouseDown = (e) => {
        if (e.target === svgRef.current || e.target.tagName === 'svg') {
            setIsDragging(true)
            setDragStart({ x: e.clientX, y: e.clientY })
        }
    }

    const handleWheel = (e) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)))
    }

    const handleZoomIn = () => setZoom(prev => Math.min(3, prev * 1.2))
    const handleZoomOut = () => setZoom(prev => Math.max(0.1, prev * 0.8))
    const handleResetZoom = () => {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    const renderCurvedPath = (x1, y1, x2, y2) => {
        const controlY1 = y1 + 50
        const controlY2 = y2 - 50

        return `M ${x1} ${y1} C ${x1} ${controlY1}, ${x2} ${controlY2}, ${x2} ${y2}`
    }

    const renderNode = (value, path, key, x, y) => {
        const type = getValueType(value)
        const isExpanded = expandedNodes.has(path)
        const isComplex = type === 'object' || type === 'array'
        const isEmpty = isComplex && (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0)
        const nodeColor = getNodeColor(value, isDarkMode)
        const position = nodePositions.get(path) || { x, y }

        return (
            <g key={path} transform={`translate(${position.x}, ${position.y})`}>
                {/* Node Rectangle */}
                <rect
                    width="220"
                    height="70"
                    rx="12"
                    fill={isDarkMode ? '#1F2937' : '#FFFFFF'}
                    stroke={nodeColor}
                    strokeWidth="2"
                    className="cursor-move hover:stroke-opacity-80 transition-all shadow-lg"
                    onMouseDown={(e) => handleNodeMouseDown(e, path)}
                />

                {/* Node Content */}
                <text
                    x="15"
                    y="25"
                    fill={isDarkMode ? '#F9FAFB' : '#111827'}
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none"
                >
                    {key}
                </text>

                {!isComplex ? (
                    <text
                        x="15"
                        y="45"
                        fill={getValueColor(value, isDarkMode)}
                        fontSize="12"
                        className="pointer-events-none"
                    >
                        {type === 'string' ? `"${value}"` : String(value)}
                    </text>
                ) : (
                    <text
                        x="15"
                        y="45"
                        fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize="12"
                        className="pointer-events-none"
                    >
                        {type === 'array' ? `${value.length} items` : `${Object.keys(value).length} properties`}
                    </text>
                )}

                {/* Expand/Collapse Button */}
                {isComplex && !isEmpty && (
                    <circle
                        cx="190"
                        cy="35"
                        r="12"
                        fill={isDarkMode ? '#374151' : '#F3F4F6'}
                        stroke={nodeColor}
                        strokeWidth="1"
                        className="cursor-pointer hover:fill-opacity-80 transition-all"
                        onClick={() => toggleNode(path)}
                    />
                )}

                {/* Expand/Collapse Icon */}
                {isComplex && !isEmpty && (
                    <text
                        x="190"
                        y="40"
                        fill={nodeColor}
                        fontSize="12"
                        textAnchor="middle"
                        className="pointer-events-none"
                    >
                        {isExpanded ? '−' : '+'}
                    </text>
                )}

                {/* Copy Button */}
                <circle
                    cx="200"
                    cy="55"
                    r="8"
                    fill={isDarkMode ? '#374151' : '#F3F4F6'}
                    stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    strokeWidth="1"
                    className="cursor-pointer hover:fill-opacity-80 transition-all"
                    onClick={() => copyValue(value)}
                />
                <text
                    x="200"
                    y="59"
                    fill={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    fontSize="10"
                    textAnchor="middle"
                    className="pointer-events-none"
                >
                    📋
                </text>
            </g>
        )
    }

    const renderConnections = (parentPath, children) => {
        if (!children || children.length === 0) return null

        return children.map((child, index) => {
            const parentPos = nodePositions.get(parentPath) || { x: 0, y: 0 }
            const childPos = nodePositions.get(child.path) || { x: 0, y: 0 }

            const x1 = parentPos.x + 220 // End of parent node
            const y1 = parentPos.y + 35 // Center of parent node
            const x2 = childPos.x // Start of child node
            const y2 = childPos.y + 35 // Center of child node

            return (
                <path
                    key={`path-${parentPath}-${index}`}
                    d={renderCurvedPath(x1, y1, x2, y2)}
                    stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="transition-all"
                />
            )
        })
    }

    const renderTree = (value, path, key, x, y, depth = 0) => {
        const type = getValueType(value)
        const isExpanded = expandedNodes.has(path)
        const isComplex = type === 'object' || type === 'array'
        const isEmpty = isComplex && (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0)

        const elements = []

        // Render the current node
        elements.push(renderNode(value, path, key, x, y))

        if (isExpanded && !isEmpty) {
            const children = []
            if (type === 'object') {
                Object.keys(value).forEach((childKey, index) => {
                    const childPath = `${path}.${childKey}`
                    const childX = x + 350
                    const childY = y + (index * 140)
                    children.push({ key: childKey, value: value[childKey], path: childPath, x: childX, y: childY })
                })
            } else if (type === 'array') {
                value.forEach((item, index) => {
                    const childPath = `${path}[${index}]`
                    const childX = x + 350
                    const childY = y + (index * 140)
                    children.push({ key: `[${index}]`, value: item, path: childPath, x: childX, y: childY })
                })
            }

            // Render connections to children
            elements.push(renderConnections(path, children))

            // Render child nodes recursively
            children.forEach(child => {
                elements.push(...renderTree(child.value, child.path, child.key, child.x, child.y, depth + 1))
            })
        }

        return elements
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Controls */}
            <div className={`flex-shrink-0 p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={handleLoadSample}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }`}
                        >
                            Load Sample
                        </button>
                        <button
                            onClick={handleClear}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }`}
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleParseJson}
                            className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                            Parse JSON
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleZoomOut}
                                className={`px-3 py-1 rounded font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                            >
                                −
                            </button>
                            <span className={`px-3 py-1 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                className={`px-3 py-1 rounded font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                            >
                                +
                            </button>
                            <button
                                onClick={handleResetZoom}
                                className={`px-3 py-1 rounded font-medium transition-colors ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Left Panel - Raw JSON */}
                <div className={`w-1/3 border-r flex flex-col ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Raw JSON
                        </h3>
                        <div className="relative flex-1">
                            <textarea
                                value={inputJson}
                                onChange={handleInputChange}
                                placeholder="Paste your JSON here..."
                                className={`w-full h-full resize-none font-mono text-sm p-4 rounded-lg border ${isDarkMode
                                        ? 'bg-gray-800 border-gray-600 text-gray-100'
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
                            <div className={`w-full h-full font-mono text-sm p-4 rounded-lg border ${isDarkMode
                                    ? 'bg-gray-800 border-gray-600'
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
                </div>

                {/* Right Panel - Visualization */}
                <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <div className="p-4 flex-shrink-0">
                        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Interactive Visualization
                        </h3>
                        <div className="text-sm text-gray-500 mb-4">
                            Drag nodes to reposition • Click +/− to expand/collapse • Click 📋 to copy values
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative border-t border-l border-r rounded-t-lg mx-4"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseDown={handleMouseDown}
                        onWheel={handleWheel}
                        style={{
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >
                        {parsedJson ? (
                            <svg
                                ref={svgRef}
                                className="w-full h-full"
                                viewBox="0 0 4000 3000"
                                style={{
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                    transformOrigin: '0 0'
                                }}
                            >
                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="10"
                                        markerHeight="7"
                                        refX="9"
                                        refY="3.5"
                                        orient="auto"
                                    >
                                        <polygon
                                            points="0 0, 10 3.5, 0 7"
                                            fill={isDarkMode ? '#6B7280' : '#9CA3AF'}
                                        />
                                    </marker>
                                </defs>

                                {/* Grid Background */}
                                <defs>
                                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke={isDarkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" opacity="0.3" />
                                    </pattern>
                                </defs>
                                <rect width="4000" height="3000" fill="url(#grid)" />

                                {renderTree(parsedJson, 'root', 'ROOT', 50, 50)}
                            </svg>
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🌳</div>
                                    <div className="text-lg font-medium mb-2">No JSON to visualize</div>
                                    <div className="text-sm">Paste your JSON in the left panel to see the interactive tree</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonVisualizerPage
