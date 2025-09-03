/**
 * Network utility functions for DNS lookups, ping, and other network operations
 */

/**
 * Performs a DNS lookup for various record types
 * @param {string} hostname - The hostname to lookup
 * @param {string} recordType - The DNS record type (A, AAAA, CNAME, MX, TXT, NS, SOA)
 * @returns {Promise<Object>} - DNS lookup result
 */
export const dnsLookup = async (hostname, recordType = 'A') => {
    if (!hostname || hostname.trim() === '') {
        throw new Error('Hostname is required')
    }

    try {
        // For client-side DNS lookups, we'll use a public DNS API
        const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=${recordType}`)

        if (!response.ok) {
            throw new Error(`DNS lookup failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.Status !== 0) {
            throw new Error(`DNS lookup failed: ${data.Comment || 'Unknown error'}`)
        }

        return {
            hostname,
            recordType,
            answers: data.Answer || [],
            authority: data.Authority || [],
            additional: data.Additional || [],
            status: 'success'
        }
    } catch (error) {
        throw new Error(`DNS lookup error: ${error.message}`)
    }
}

/**
 * Performs multiple DNS lookups for common record types
 * @param {string} hostname - The hostname to lookup
 * @returns {Promise<Object>} - Combined DNS lookup results
 */
export const comprehensiveDnsLookup = async (hostname) => {
    const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA']
    const results = {}

    for (const recordType of recordTypes) {
        try {
            results[recordType] = await dnsLookup(hostname, recordType)
        } catch (error) {
            results[recordType] = {
                hostname,
                recordType,
                error: error.message,
                status: 'error'
            }
        }
    }

    return results
}

/**
 * Checks if a host is reachable (simplified ping using fetch)
 * @param {string} hostname - The hostname to ping
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Ping result
 */
export const pingHost = async (hostname, timeout = 5000) => {
    if (!hostname || hostname.trim() === '') {
        throw new Error('Hostname is required')
    }

    const startTime = Date.now()

    try {
        // Use a simple HTTP request to check connectivity
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(`https://${hostname}`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        })

        clearTimeout(timeoutId)
        const endTime = Date.now()
        const responseTime = endTime - startTime

        return {
            hostname,
            reachable: true,
            responseTime,
            status: 'success',
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        const endTime = Date.now()
        const responseTime = endTime - startTime

        return {
            hostname,
            reachable: false,
            responseTime,
            error: error.message,
            status: 'error',
            timestamp: new Date().toISOString()
        }
    }
}

/**
 * Checks SSL certificate information
 * @param {string} hostname - The hostname to check
 * @returns {Promise<Object>} - SSL certificate information
 */
export const checkSSL = async (hostname) => {
    if (!hostname || hostname.trim() === '') {
        throw new Error('Hostname is required')
    }

    try {
        // Use SSL Labs API for certificate information
        const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(hostname)}&publish=off&fromCache=on&maxAge=1`)

        if (!response.ok) {
            throw new Error(`SSL check failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        return {
            hostname,
            status: data.status,
            grade: data.grade,
            endpoints: data.endpoints || [],
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        throw new Error(`SSL check error: ${error.message}`)
    }
}

/**
 * Performs a basic port scan (limited to common ports due to browser restrictions)
 * @param {string} hostname - The hostname to scan
 * @param {Array<number>} ports - Array of ports to scan
 * @returns {Promise<Object>} - Port scan results
 */
export const portScan = async (hostname, ports = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995]) => {
    if (!hostname || hostname.trim() === '') {
        throw new Error('Hostname is required')
    }

    const results = []

    for (const port of ports) {
        try {
            const startTime = Date.now()

            // Use WebSocket or fetch to check port availability
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000)

            let isOpen = false
            let responseTime = 0

            try {
                // Try HTTPS first for common ports
                if (port === 443) {
                    const response = await fetch(`https://${hostname}:${port}`, {
                        method: 'HEAD',
                        mode: 'no-cors',
                        signal: controller.signal
                    })
                    isOpen = true
                } else if (port === 80) {
                    const response = await fetch(`http://${hostname}:${port}`, {
                        method: 'HEAD',
                        mode: 'no-cors',
                        signal: controller.signal
                    })
                    isOpen = true
                }

                clearTimeout(timeoutId)
                responseTime = Date.now() - startTime
            } catch (error) {
                clearTimeout(timeoutId)
                responseTime = Date.now() - startTime
                isOpen = false
            }

            results.push({
                port,
                isOpen,
                responseTime,
                service: getServiceName(port)
            })
        } catch (error) {
            results.push({
                port,
                isOpen: false,
                error: error.message,
                service: getServiceName(port)
            })
        }
    }

    return {
        hostname,
        ports: results,
        timestamp: new Date().toISOString()
    }
}

/**
 * Gets service name for common ports
 * @param {number} port - The port number
 * @returns {string} - Service name
 */
const getServiceName = (port) => {
    const services = {
        21: 'FTP',
        22: 'SSH',
        23: 'Telnet',
        25: 'SMTP',
        53: 'DNS',
        80: 'HTTP',
        110: 'POP3',
        143: 'IMAP',
        443: 'HTTPS',
        993: 'IMAPS',
        995: 'POP3S',
        3389: 'RDP',
        5432: 'PostgreSQL',
        3306: 'MySQL',
        6379: 'Redis',
        27017: 'MongoDB'
    }

    return services[port] || 'Unknown'
}

/**
 * Validates email domain by checking MX records
 * @param {string} email - The email address to validate
 * @returns {Promise<Object>} - Email validation result
 */
export const validateEmailDomain = async (email) => {
    if (!email || email.trim() === '') {
        throw new Error('Email is required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format')
    }

    const domain = email.split('@')[1]

    try {
        const mxResult = await dnsLookup(domain, 'MX')

        return {
            email,
            domain,
            hasMX: mxResult.answers.length > 0,
            mxRecords: mxResult.answers,
            isValid: mxResult.answers.length > 0,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        return {
            email,
            domain,
            hasMX: false,
            mxRecords: [],
            isValid: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }
    }
}

/**
 * Comprehensive email diagnostics including MX, SPF, DKIM, DMARC
 * @param {string} domain - The domain to analyze
 * @returns {Promise<Object>} - Complete email diagnostics
 */
export const emailDiagnostics = async (domain) => {
    if (!domain || domain.trim() === '') {
        throw new Error('Domain is required')
    }

    const results = {
        domain: domain.trim(),
        timestamp: new Date().toISOString(),
        mx: { status: 'pending' },
        spf: { status: 'pending' },
        dkim: { status: 'pending' },
        dmarc: { status: 'pending' },
        issues: [],
        recommendations: []
    }

    try {
        // Check MX Records
        try {
            const mxResult = await dnsLookup(domain, 'MX')
            results.mx = {
                status: 'success',
                records: mxResult.answers,
                hasRecords: mxResult.answers.length > 0
            }
            if (mxResult.answers.length === 0) {
                results.issues.push('No MX records found - emails cannot be delivered')
                results.recommendations.push('Add MX records pointing to your mail server')
            }
        } catch (error) {
            results.mx = { status: 'error', error: error.message }
            results.issues.push('MX record lookup failed')
        }

        // Check SPF Record
        try {
            const spfResult = await dnsLookup(domain, 'TXT')
            const spfRecords = spfResult.answers.filter(record => 
                record.data.toLowerCase().startsWith('v=spf1')
            )
            
            results.spf = {
                status: 'success',
                records: spfRecords,
                hasRecords: spfRecords.length > 0
            }
            
            if (spfRecords.length === 0) {
                results.issues.push('No SPF record found - emails may be marked as spam')
                results.recommendations.push('Add SPF record: v=spf1 include:_spf.google.com ~all')
            } else {
                // Analyze SPF record
                const spfRecord = spfRecords[0].data
                if (spfRecord.includes('~all')) {
                    results.issues.push('SPF record uses soft fail (~all) - consider using hard fail (-all)')
                    results.recommendations.push('Change SPF record to use -all instead of ~all for better security')
                }
                if (!spfRecord.includes('include:')) {
                    results.issues.push('SPF record may be too restrictive')
                    results.recommendations.push('Consider adding include: statements for your email providers')
                }
            }
        } catch (error) {
            results.spf = { status: 'error', error: error.message }
            results.issues.push('SPF record lookup failed')
        }

        // Check DMARC Record
        try {
            const dmarcResult = await dnsLookup(`_dmarc.${domain}`, 'TXT')
            const dmarcRecords = dmarcResult.answers.filter(record => 
                record.data.toLowerCase().startsWith('v=dmarc1')
            )
            
            results.dmarc = {
                status: 'success',
                records: dmarcRecords,
                hasRecords: dmarcRecords.length > 0
            }
            
            if (dmarcRecords.length === 0) {
                results.issues.push('No DMARC record found - domain vulnerable to email spoofing')
                results.recommendations.push('Add DMARC record: v=DMARC1; p=quarantine; rua=mailto:dmarc@' + domain)
            } else {
                // Analyze DMARC record
                const dmarcRecord = dmarcRecords[0].data
                if (!dmarcRecord.includes('p=')) {
                    results.issues.push('DMARC record missing policy (p=)')
                    results.recommendations.push('Add policy to DMARC record: p=quarantine or p=reject')
                }
                if (!dmarcRecord.includes('rua=')) {
                    results.issues.push('DMARC record missing aggregate reports (rua=)')
                    results.recommendations.push('Add aggregate reporting: rua=mailto:dmarc@' + domain)
                }
                if (!dmarcRecord.includes('ruf=')) {
                    results.issues.push('DMARC record missing forensic reports (ruf=)')
                    results.recommendations.push('Add forensic reporting: ruf=mailto:dmarc@' + domain)
                }
            }
        } catch (error) {
            results.dmarc = { status: 'error', error: error.message }
            results.issues.push('DMARC record lookup failed')
        }

        // Check DKIM Records (common selectors)
        try {
            const commonSelectors = ['default', 'google', 'k1', 'selector1', 'selector2', 'mail', 'dkim']
            const dkimResults = []
            
            for (const selector of commonSelectors) {
                try {
                    const dkimResult = await dnsLookup(`${selector}._domainkey.${domain}`, 'TXT')
                    const dkimRecords = dkimResult.answers.filter(record => 
                        record.data.toLowerCase().includes('v=dkim1')
                    )
                    if (dkimRecords.length > 0) {
                        dkimResults.push({
                            selector,
                            records: dkimRecords
                        })
                    }
                } catch (error) {
                    // Selector not found, continue
                }
            }
            
            results.dkim = {
                status: 'success',
                selectors: dkimResults,
                hasRecords: dkimResults.length > 0
            }
            
            if (dkimResults.length === 0) {
                results.issues.push('No DKIM records found - emails may be marked as spam')
                results.recommendations.push('Set up DKIM signing with your email provider')
            }
        } catch (error) {
            results.dkim = { status: 'error', error: error.message }
            results.issues.push('DKIM record lookup failed')
        }

        // Generate overall health score
        const totalChecks = 4
        const passedChecks = [
            results.mx.hasRecords,
            results.spf.hasRecords,
            results.dmarc.hasRecords,
            results.dkim.hasRecords
        ].filter(Boolean).length
        
        results.healthScore = Math.round((passedChecks / totalChecks) * 100)
        
        if (results.healthScore < 50) {
            results.issues.push('Critical email delivery issues detected')
            results.recommendations.push('Immediate action required to fix email delivery')
        } else if (results.healthScore < 75) {
            results.issues.push('Some email delivery issues detected')
            results.recommendations.push('Address remaining issues to improve email deliverability')
        }

        return results
    } catch (error) {
        throw new Error(`Email diagnostics failed: ${error.message}`)
    }
}

/**
 * Generates email configuration recommendations
 * @param {string} domain - The domain to generate configs for
 * @param {string} emailProvider - The email provider (gmail, outlook, custom)
 * @returns {Object} - Configuration recommendations
 */
export const generateEmailConfigs = (domain, emailProvider = 'custom') => {
    const configs = {
        domain,
        provider: emailProvider,
        timestamp: new Date().toISOString()
    }

    switch (emailProvider.toLowerCase()) {
        case 'gmail':
        case 'google':
            configs.spf = 'v=spf1 include:_spf.google.com ~all'
            configs.dmarc = `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; fo=1`
            configs.dkim = 'Set up DKIM in Google Admin Console'
            configs.mx = [
                { priority: 1, target: 'ASPMX.L.GOOGLE.COM.' },
                { priority: 5, target: 'ALT1.ASPMX.L.GOOGLE.COM.' },
                { priority: 5, target: 'ALT2.ASPMX.L.GOOGLE.COM.' },
                { priority: 10, target: 'ALT3.ASPMX.L.GOOGLE.COM.' },
                { priority: 10, target: 'ALT4.ASPMX.L.GOOGLE.COM.' }
            ]
            break
            
        case 'outlook':
        case 'microsoft':
            configs.spf = 'v=spf1 include:spf.protection.outlook.com -all'
            configs.dmarc = `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; fo=1`
            configs.dkim = 'Set up DKIM in Microsoft 365 Admin Center'
            configs.mx = [
                { priority: 0, target: `${domain}-mail.protection.outlook.com.` }
            ]
            break
            
        case 'custom':
        default:
            configs.spf = `v=spf1 mx ip4:YOUR_SERVER_IP -all`
            configs.dmarc = `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}; ruf=mailto:dmarc@${domain}; fo=1`
            configs.dkim = 'Set up DKIM with your mail server'
            configs.mx = [
                { priority: 10, target: `mail.${domain}.` }
            ]
            break
    }

    return configs
}

/**
 * Gets WHOIS information for a domain using DNS records
 * @param {string} domain - The domain to lookup
 * @returns {Promise<Object>} - WHOIS information
 */
export const getWhois = async (domain) => {
    if (!domain || domain.trim() === '') {
        throw new Error('Domain is required')
    }

    try {
        // Use DNS records to get basic domain information
        const dnsResults = await comprehensiveDnsLookup(domain)
        
        // Extract useful information from DNS records
        const whoisInfo = {
            domain: domain,
            created: 'Not available via DNS',
            updated: 'Not available via DNS',
            expires: 'Not available via DNS',
            registrar: 'Not available via DNS',
            nameServers: [],
            status: []
        }

        // Extract nameservers from NS records
        if (dnsResults.NS && dnsResults.NS.answers) {
            whoisInfo.nameServers = dnsResults.NS.answers.map(answer => answer.data)
        }

        // Extract information from TXT records
        if (dnsResults.TXT && dnsResults.TXT.answers) {
            const txtRecords = dnsResults.TXT.answers.map(answer => answer.data)
            whoisInfo.txtRecords = txtRecords
        }

        // Extract IP addresses from A records
        if (dnsResults.A && dnsResults.A.answers) {
            whoisInfo.ipAddresses = dnsResults.A.answers.map(answer => answer.data)
        }

        // Extract IPv6 addresses from AAAA records
        if (dnsResults.AAAA && dnsResults.AAAA.answers) {
            whoisInfo.ipv6Addresses = dnsResults.AAAA.answers.map(answer => answer.data)
        }

        // Extract mail servers from MX records
        if (dnsResults.MX && dnsResults.MX.answers) {
            whoisInfo.mailServers = dnsResults.MX.answers.map(answer => {
                const parts = answer.data.split(' ')
                return {
                    priority: parseInt(parts[0]),
                    server: parts[1]
                }
            })
        }

        return {
            domain,
            whois: whoisInfo,
            timestamp: new Date().toISOString(),
            note: 'This is DNS-based information. For full WHOIS data, use a dedicated WHOIS service.'
        }
    } catch (error) {
        throw new Error(`WHOIS lookup error: ${error.message}`)
    }
}

/**
 * Checks if a URL is accessible
 * @param {string} url - The URL to check
 * @returns {Promise<Object>} - URL accessibility result
 */
export const checkURL = async (url) => {
    if (!url || url.trim() === '') {
        throw new Error('URL is required')
    }

    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
    }

    const startTime = Date.now()

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors'
        })

        const endTime = Date.now()
        const responseTime = endTime - startTime

        return {
            url,
            accessible: true,
            responseTime,
            status: 'success',
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        const endTime = Date.now()
        const responseTime = endTime - startTime

        return {
            url,
            accessible: false,
            responseTime,
            error: error.message,
            status: 'error',
            timestamp: new Date().toISOString()
        }
    }
}
