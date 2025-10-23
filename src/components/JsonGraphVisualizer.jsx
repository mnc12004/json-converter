import React, { useState, useRef, useEffect } from 'react'

const JsonGraphVisualizer = ({ jsonData, isDarkMode, zoom, pan, isDragging, onMouseDown, onMouseMove, onMouseUp }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set())
    const [nodePositions, setNodePositions] = useState(new Map())
    const svgRef = useRef(null)

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

    const renderNode = (value, path, key, x, y) => {
        const type = getValueType(value)
        const isExpanded = expandedNodes.has(path)
        const isComplex = type === 'object' || type === 'array'
        const isEmpty = isComplex && (Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0)
        const nodeColor = getNodeColor(value, isDarkMode)

        return (
            <g key={path} transform={`translate(${x}, ${y})`}>
                {/* Node Rectangle */}
                <rect
                    width="200"
                    height="60"
                    rx="8"
                    fill={isDarkMode ? '#1F2937' : '#FFFFFF'}
                    stroke={nodeColor}
                    strokeWidth="2"
                    className="cursor-pointer hover:stroke-opacity-80 transition-all"
                    onClick={() => isComplex && !isEmpty && toggleNode(path)}
                />

                {/* Node Content */}
                <text
                    x="10"
                    y="20"
                    fill={isDarkMode ? '#F9FAFB' : '#111827'}
                    fontSize="14"
                    fontWeight="bold"
                    className="pointer-events-none"
                >
                    {key}
                </text>

                {!isComplex ? (
                    <text
                        x="10"
                        y="40"
                        fill={getValueColor(value, isDarkMode)}
                        fontSize="12"
                        className="pointer-events-none"
                    >
                        {type === 'string' ? `"${value}"` : String(value)}
                    </text>
                ) : (
                    <text
                        x="10"
                        y="40"
                        fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize="12"
                        className="pointer-events-none"
                    >
                        {type === 'array' ? `${value.length} items` : `${Object.keys(value).length} properties`}
                    </text>
                )}

                {/* Expand/Collapse Indicator */}
                {isComplex && !isEmpty && (
                    <text
                        x="180"
                        y="35"
                        fill={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        fontSize="16"
                        className="pointer-events-none"
                    >
                        {isExpanded ? '▼' : '▶'}
                    </text>
                )}
            </g>
        )
    }

    const renderConnections = (parentPath, children, parentX, parentY) => {
        if (!children || children.length === 0) return null

        return children.map((child, index) => {
            const childX = parentX + 250
            const childY = parentY + (index * 100)

            return (
                <line
                    key={`line-${parentPath}-${index}`}
                    x1={parentX + 200}
                    y1={parentY + 30}
                    x2={childX}
                    y2={childY + 30}
                    stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
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
                    const childX = x + 250
                    const childY = y + (index * 100)
                    children.push({ key: childKey, value: value[childKey], path: childPath, x: childX, y: childY })
                })
            } else if (type === 'array') {
                value.forEach((item, index) => {
                    const childPath = `${path}[${index}]`
                    const childX = x + 250
                    const childY = y + (index * 100)
                    children.push({ key: `[${index}]`, value: item, path: childPath, x: childX, y: childY })
                })
            }

            // Render connections to children
            children.forEach((child, index) => {
                elements.push(
                    <line
                        key={`line-${path}-${index}`}
                        x1={x + 200}
                        y1={y + 30}
                        x2={child.x}
                        y2={child.y + 30}
                        stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />
                )
            })

            // Render child nodes recursively
            children.forEach(child => {
                elements.push(...renderTree(child.value, child.path, child.key, child.x, child.y, depth + 1))
            })
        }

        return elements
    }

    if (!jsonData) {
        return (
            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No JSON data to visualize
            </div>
        )
    }

    return (
        <div
            className="w-full h-full overflow-hidden relative"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
            <svg
                ref={svgRef}
                className="w-full h-full"
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

                {renderTree(jsonData, 'root', 'ROOT', 50, 50)}
            </svg>
        </div>
    )
}

export default JsonGraphVisualizer
