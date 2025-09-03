import React, { useRef, useEffect, useState } from 'react'
import JsonHighlighter from './JsonHighlighter'

const JsonEditor = ({
    value,
    onChange,
    placeholder,
    readOnly = false,
    isDarkMode = false,
    className = ""
}) => {
    const textareaRef = useRef(null)
    const highlightRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (textareaRef.current && highlightRef.current) {
            const textarea = textareaRef.current
            const highlight = highlightRef.current

            // Sync scroll positions
            const syncScroll = () => {
                highlight.scrollTop = textarea.scrollTop
                highlight.scrollLeft = textarea.scrollLeft
            }

            textarea.addEventListener('scroll', syncScroll)
            return () => textarea.removeEventListener('scroll', syncScroll)
        }
    }, [])

    const handleChange = (e) => {
        onChange(e)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const textarea = textareaRef.current
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.substring(0, start) + '  ' + value.substring(end)
            onChange({ target: { value: newValue } })

            // Set cursor position after the inserted spaces
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2
            }, 0)
        }
    }

    return (
        <div className={`relative ${className}`}>
            {/* Syntax highlighted background */}
            <div
                ref={highlightRef}
                className={`absolute inset-0 p-3 font-mono text-sm overflow-auto pointer-events-none ${isDarkMode
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-50 text-gray-900'
                    } ${readOnly ? 'bg-opacity-50' : ''}`}
                style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    lineHeight: '1.5',
                    minHeight: '320px',
                    whiteSpace: 'pre-wrap'
                }}
            >
                <JsonHighlighter json={value} isDarkMode={isDarkMode} />
            </div>

            {/* Editable textarea */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`relative w-full p-3 font-mono text-sm border rounded-lg resize-none transition-colors duration-200 ${isDarkMode
                    ? 'bg-transparent text-transparent border-gray-600 focus:ring-primary-400 focus:border-primary-400'
                    : 'bg-transparent text-transparent border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    } ${readOnly ? 'cursor-default' : 'cursor-text'} ${isFocused ? 'ring-2' : ''
                    }`}
                style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    lineHeight: '1.5',
                    minHeight: '320px',
                    caretColor: isDarkMode ? '#60a5fa' : '#3b82f6',
                    whiteSpace: 'pre-wrap'
                }}
                spellCheck={false}
            />
        </div>
    )
}

export default JsonEditor
