/**
 * Validates JSON string
 * @param {string} jsonString - The JSON string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        JSON.parse(jsonString)
        return true
    } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`)
    }
}

/**
 * Formats JSON string with proper indentation
 * @param {string} jsonString - The JSON string to format
 * @returns {string} - Formatted JSON string
 */
export const formatJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)
        return JSON.stringify(parsed, null, 2)
    } catch (error) {
        throw new Error(`Formatting error: ${error.message}`)
    }
}

/**
 * Minifies JSON string by removing whitespace
 * @param {string} jsonString - The JSON string to minify
 * @returns {string} - Minified JSON string
 */
export const minifyJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)
        return JSON.stringify(parsed)
    } catch (error) {
        throw new Error(`Minification error: ${error.message}`)
    }
}

/**
 * Converts JSON to YAML format
 * @param {string} jsonString - The JSON string to convert
 * @returns {string} - YAML string
 */
export const convertToYaml = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)
        return jsonToYaml(parsed, 0)
    } catch (error) {
        throw new Error(`YAML conversion error: ${error.message}`)
    }
}

/**
 * Converts JSON to XML format
 * @param {string} jsonString - The JSON string to convert
 * @returns {string} - XML string
 */
export const convertToXml = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)
        return jsonToXml(parsed, 'root')
    } catch (error) {
        throw new Error(`XML conversion error: ${error.message}`)
    }
}

/**
 * Helper function to convert JavaScript object to YAML
 * @param {any} obj - The object to convert
 * @param {number} indent - Current indentation level
 * @returns {string} - YAML string
 */
const jsonToYaml = (obj, indent = 0) => {
    const spaces = '  '.repeat(indent)

    if (obj === null) return 'null'
    if (typeof obj === 'undefined') return 'undefined'
    if (typeof obj === 'string') return `"${obj}"`
    if (typeof obj === 'number' || typeof obj === 'boolean') return obj.toString()

    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]'
        return obj.map(item => `${spaces}- ${jsonToYaml(item, indent + 1)}`).join('\n')
    }

    if (typeof obj === 'object') {
        const entries = Object.entries(obj)
        if (entries.length === 0) return '{}'

        return entries.map(([key, value]) => {
            const yamlValue = jsonToYaml(value, indent + 1)
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${spaces}${key}:\n${yamlValue}`
            }
            return `${spaces}${key}: ${yamlValue}`
        }).join('\n')
    }

    return obj.toString()
}

/**
 * Helper function to convert JavaScript object to XML
 * @param {any} obj - The object to convert
 * @param {string} rootName - The root element name
 * @returns {string} - XML string
 */
const jsonToXml = (obj, rootName = 'root') => {
    const escapeXml = (str) => {
        if (typeof str !== 'string') return str
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    const convertValue = (value, key) => {
        if (value === null) return `<${key}></${key}>`
        if (typeof value === 'undefined') return `<${key}></${key}>`
        if (typeof value === 'string') return `<${key}>${escapeXml(value)}</${key}>`
        if (typeof value === 'number' || typeof value === 'boolean') {
            return `<${key}>${value}</${key}>`
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return `<${key}></${key}>`
            return value.map((item, index) => {
                const itemKey = `${key.slice(0, -1)}_item` // Convert plural to singular
                return convertValue(item, itemKey)
            }).join('')
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value)
            if (entries.length === 0) return `<${key}></${key}>`

            const innerXml = entries.map(([innerKey, innerValue]) => {
                return convertValue(innerValue, innerKey)
            }).join('')

            return `<${key}>${innerXml}</${key}>`
        }

        return `<${key}>${escapeXml(value.toString())}</${key}>`
    }

    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        const entries = Object.entries(obj)
        if (entries.length === 0) return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}></${rootName}>`

        const innerXml = entries.map(([key, value]) => {
            return convertValue(value, key)
        }).join('')

        return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${innerXml}\n</${rootName}>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${escapeXml(obj.toString())}</${rootName}>`
}

/**
 * Auto-fixes common JSON syntax errors
 * @param {string} jsonString - The JSON string to fix
 * @returns {string} - Fixed JSON string
 */
export const autoFixJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        // First, try to parse as-is
        JSON.parse(jsonString)
        return jsonString // Already valid
    } catch (error) {
        // Attempt to fix common issues
        let fixed = jsonString.trim()

        // Fix 1: Add missing quotes around object keys
        fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

        // Fix 2: Replace single quotes with double quotes
        fixed = fixed.replace(/'/g, '"')

        // Fix 3: Remove trailing commas
        fixed = fixed.replace(/,(\s*[}\]])/g, '$1')

        // Fix 4: Add missing commas between array/object elements
        fixed = fixed.replace(/([}\]\"])\s*([a-zA-Z_$"\[\{])/g, '$1,$2')

        // Fix 5: Fix common boolean/null values
        fixed = fixed.replace(/\btrue\b/g, 'true')
        fixed = fixed.replace(/\bfalse\b/g, 'false')
        fixed = fixed.replace(/\bnull\b/g, 'null')

        // Fix 6: Remove comments (// and /* */)
        fixed = fixed.replace(/\/\/.*$/gm, '')
        fixed = fixed.replace(/\/\*[\s\S]*?\*\//g, '')

        // Fix 7: Fix unescaped quotes in strings
        fixed = fixed.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
            // Only fix if there are unescaped quotes inside
            if (content.includes('"') && !content.includes('\\"')) {
                return `"${content.replace(/"/g, '\\"')}"`
            }
            return match
        })

        // Fix 8: Add missing opening/closing braces/brackets
        const openBraces = (fixed.match(/\{/g) || []).length
        const closeBraces = (fixed.match(/\}/g) || []).length
        const openBrackets = (fixed.match(/\[/g) || []).length
        const closeBrackets = (fixed.match(/\]/g) || []).length

        // Add missing closing braces
        if (openBraces > closeBraces) {
            fixed += '}'.repeat(openBraces - closeBraces)
        }

        // Add missing closing brackets
        if (openBrackets > closeBrackets) {
            fixed += ']'.repeat(openBrackets - closeBrackets)
        }

        // Fix 9: Handle common JavaScript object notation
        // Convert {key: value} to {"key": value}
        fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')

        // Fix 10: Remove extra commas at the beginning
        fixed = fixed.replace(/^,/, '')

        // Try to parse the fixed version
        try {
            JSON.parse(fixed)
            return fixed
        } catch (fixError) {
            // If still invalid, try a more aggressive approach
            return attemptAdvancedFix(jsonString)
        }
    }
}

/**
 * Advanced JSON fixing for more complex issues
 * @param {string} jsonString - The JSON string to fix
 * @returns {string} - Fixed JSON string
 */
const attemptAdvancedFix = (jsonString) => {
    let fixed = jsonString.trim()

    // Try to wrap in braces if it looks like a root object without braces
    if (!fixed.startsWith('{') && !fixed.startsWith('[') && fixed.includes(':')) {
        fixed = `{${fixed}}`
    }

    // Try to fix malformed arrays
    if (fixed.startsWith('[') && !fixed.endsWith(']')) {
        fixed += ']'
    }

    // Try to fix malformed objects
    if (fixed.startsWith('{') && !fixed.endsWith('}')) {
        fixed += '}'
    }

    // Final attempt to parse
    try {
        JSON.parse(fixed)
        return fixed
    } catch (error) {
        throw new Error(`Unable to auto-fix JSON. Original error: ${error.message}`)
    }
}

/**
 * Extracts and unescapes nested JSON from RevenueCat webhook format
 * @param {string} jsonString - The JSON string containing escaped JSON
 * @returns {string} - Extracted and unescaped JSON string
 */
export const extractRevenueCatJson = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)

        // Check if this looks like a RevenueCat webhook
        if (parsed.request_body && typeof parsed.request_body === 'string') {
            try {
                // Try to parse the nested JSON
                const nestedJson = JSON.parse(parsed.request_body)
                return JSON.stringify(nestedJson, null, 2)
            } catch (nestedError) {
                // If nested parsing fails, return the original
                throw new Error(`Could not parse nested JSON in request_body: ${nestedError.message}`)
            }
        }

        // If no request_body field, return original formatted
        return JSON.stringify(parsed, null, 2)
    } catch (error) {
        throw new Error(`RevenueCat extraction error: ${error.message}`)
    }
}

/**
 * Extracts and unescapes nested JSON from any field containing escaped JSON
 * @param {string} jsonString - The JSON string containing escaped JSON
 * @param {string} fieldName - The field name containing the escaped JSON (default: 'request_body')
 * @returns {string} - Extracted and unescaped JSON string
 */
export const extractNestedJson = (jsonString, fieldName = 'request_body') => {
    if (!jsonString || jsonString.trim() === '') {
        throw new Error('Empty JSON string')
    }

    try {
        const parsed = JSON.parse(jsonString)

        // Check if the specified field exists and contains a string
        if (parsed[fieldName] && typeof parsed[fieldName] === 'string') {
            try {
                // Try to parse the nested JSON
                const nestedJson = JSON.parse(parsed[fieldName])
                return JSON.stringify(nestedJson, null, 2)
            } catch (nestedError) {
                throw new Error(`Could not parse nested JSON in ${fieldName}: ${nestedError.message}`)
            }
        }

        throw new Error(`Field '${fieldName}' not found or not a string`)
    } catch (error) {
        throw new Error(`Nested JSON extraction error: ${error.message}`)
    }
}

/**
 * Additional utility functions
 */

/**
 * Gets the size of JSON in bytes
 * @param {string} jsonString - The JSON string
 * @returns {number} - Size in bytes
 */
export const getJsonSize = (jsonString) => {
    return new Blob([jsonString]).size
}

/**
 * Counts the number of keys in JSON object
 * @param {string} jsonString - The JSON string
 * @returns {number} - Number of keys
 */
export const countKeys = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString)
        return countKeysRecursive(parsed)
    } catch (error) {
        throw new Error(`Key counting error: ${error.message}`)
    }
}

/**
 * Recursively counts keys in an object
 * @param {any} obj - The object to count keys in
 * @returns {number} - Total number of keys
 */
const countKeysRecursive = (obj) => {
    if (typeof obj !== 'object' || obj === null) return 0

    if (Array.isArray(obj)) {
        return obj.reduce((count, item) => count + countKeysRecursive(item), 0)
    }

    return Object.keys(obj).length + Object.values(obj).reduce((count, value) => {
        return count + countKeysRecursive(value)
    }, 0)
}
