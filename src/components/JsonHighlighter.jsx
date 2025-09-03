import React from 'react'

const JsonHighlighter = ({ json, isDarkMode = false }) => {
    const highlightJson = (jsonString) => {
        if (!jsonString) return ''

        try {
            // Parse and stringify to ensure valid JSON
            const parsed = JSON.parse(jsonString)
            const formatted = JSON.stringify(parsed, null, 2)

            return formatted
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
                    let className = ''

                    // Strings
                    if (match.startsWith('"')) {
                        if (match.endsWith(':')) {
                            // Object keys
                            className = isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        } else {
                            // String values
                            className = isDarkMode ? 'text-green-400' : 'text-green-600'
                        }
                    }
                    // Numbers
                    else if (/^-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?$/.test(match)) {
                        className = isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    }
                    // Booleans and null
                    else if (['true', 'false', 'null'].includes(match)) {
                        className = isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }

                    return `<span class="${className}">${match}</span>`
                })
                .replace(/([{}[\]])/g, (match) => {
                    const className = isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    return `<span class="${className} font-bold">${match}</span>`
                })
                .replace(/(,)/g, (match) => {
                    const className = isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    return `<span class="${className}">${match}</span>`
                })
        } catch (error) {
            // If JSON is invalid, try to highlight what we can
            return jsonString
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g, (match) => {
                    const className = isDarkMode ? 'text-green-400' : 'text-green-600'
                    return `<span class="${className}">${match}</span>`
                })
                .replace(/(\b(true|false|null)\b)/g, (match) => {
                    const className = isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    return `<span class="${className}">${match}</span>`
                })
                .replace(/(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
                    const className = isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    return `<span class="${className}">${match}</span>`
                })
                .replace(/([{}[\]])/g, (match) => {
                    const className = isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    return `<span class="${className} font-bold">${match}</span>`
                })
                .replace(/(,)/g, (match) => {
                    const className = isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    return `<span class="${className}">${match}</span>`
                })
        }
    }

    return (
        <pre
            className="json-highlight whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
                __html: highlightJson(json)
            }}
        />
    )
}

export default JsonHighlighter
