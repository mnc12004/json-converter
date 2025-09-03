import React from 'react'
import JsonHighlighter from './JsonHighlighter'

const JsonViewer = ({ json, isDarkMode = false, className = "" }) => {
    return (
        <div
            className={`p-3 font-mono text-sm border rounded-lg overflow-auto ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } ${className}`}
            style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                lineHeight: '1.5',
                minHeight: '320px'
            }}
        >
            {json ? (
                <JsonHighlighter json={json} isDarkMode={isDarkMode} />
            ) : (
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Converted output will appear here...
                </span>
            )}
        </div>
    )
}

export default JsonViewer
