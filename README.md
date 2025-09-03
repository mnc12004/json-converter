# 🚀 JSON Converter & Network Tools

A powerful React-based web application that combines JSON processing utilities with comprehensive network diagnostic tools. Built with modern web technologies and designed for developers, system administrators, and IT professionals.

## ✨ Features

### 📄 JSON Tools
- **JSON Formatting** - Pretty-print and validate JSON data
- **JSON Minification** - Compress JSON for production use
- **JSON Validation** - Check syntax and structure
- **Auto-Fix JSON** - Automatically repair common JSON syntax errors
- **RevenueCat Extraction** - Parse nested JSON from RevenueCat webhooks
- **Format Conversion** - Convert between JSON, YAML, and XML formats

### 🌐 Network Tools
- **DNS Lookups** - A, AAAA, CNAME, MX, TXT, NS, SOA records
- **Ping Testing** - Check host availability and response times
- **Port Scanning** - Test port accessibility
- **SSL Certificate Analysis** - Detailed SSL/TLS certificate information
- **Email Diagnostics** - Comprehensive email delivery analysis (MX, SPF, DKIM, DMARC)
- **WHOIS Lookup** - Domain registration information
- **URL Accessibility** - Check if URLs are reachable

### 🎨 User Experience
- **Dark/Light Mode** - Toggle between themes
- **Syntax Highlighting** - Color-coded JSON formatting
- **Mobile Responsive** - Works on all devices
- **Real-time Validation** - Instant feedback on input
- **Copy to Clipboard** - Easy sharing of results

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0 with Vite
- **Styling**: TailwindCSS 3.4.0
- **Build Tool**: Vite 4.5.14
- **Deployment**: IIS/Plesk compatible
- **APIs**: Google DNS, SSL Labs, WHOIS services

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/json-converter.git
cd json-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Serve production build locally
npm run serve
```

## 📦 Project Structure

```
json-converter/
├── src/
│   ├── components/
│   │   ├── JsonConverter.jsx      # Main JSON processing component
│   │   ├── NetworkTools.jsx        # Network diagnostic tools
│   │   ├── JsonEditor.jsx          # Syntax-highlighted JSON input
│   │   ├── JsonViewer.jsx          # Read-only JSON display
│   │   └── JsonHighlighter.jsx    # JSON syntax highlighting
│   ├── utils/
│   │   ├── jsonUtils.js           # JSON processing utilities
│   │   └── networkUtils.js        # Network API integrations
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── dist/                          # Production build output
├── public/                        # Static assets
├── web.config                     # IIS configuration
└── package.json                   # Dependencies and scripts
```

## 🔧 Configuration

### Development
The app runs on `http://localhost:5173` by default with hot reload enabled.

### Production Deployment
The app is configured for IIS/Plesk deployment with a minimal `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?><configuration><system.webServer><staticContent><mimeMap fileExtension=".json" mimeType="application/json" /></staticContent></system.webServer></configuration>
```

## 🌐 API Integrations

### External APIs Used
- **Google DNS API** - DNS lookups (`https://dns.google`)
- **SSL Labs API** - SSL certificate analysis (`https://api.ssllabs.com`)
- **WHOIS Services** - Domain registration lookup

### API Rate Limits
- Google DNS: No rate limits
- SSL Labs: 25 requests per day per IP
- WHOIS: Varies by provider

### CORS Considerations
All external APIs support CORS for browser-based requests. The app is designed to work entirely client-side without requiring a backend server.

## 🎯 Usage Examples

### JSON Processing
```javascript
// Auto-fix broken JSON
const brokenJson = "{name: 'John', age: 30,}";
const fixedJson = autoFixJson(brokenJson);

// Extract RevenueCat data
const revenueCatData = extractRevenueCatJson(webhookPayload);
```

### Network Diagnostics
```javascript
// DNS lookup
const dnsResults = await performDnsLookup('google.com', 'A');

// SSL certificate check
const sslResults = await checkSslCertificate('google.com');

// Email diagnostics
const emailHealth = await emailDiagnostics('example.com');
```

## 🔒 Security Features

- **Content Security Policy** - Restricts resource loading
- **XSS Protection** - Cross-site scripting prevention
- **HTTPS Enforcement** - Secure connections required
- **No Data Storage** - Client-side only, no server storage
- **API Security** - All external calls use HTTPS

## 🚀 Deployment

### IIS/Plesk Deployment
1. Run `npm run build`
2. Upload `dist/` folder contents to your web server
3. Ensure `web.config` is in the document root
4. Configure SSL certificate (recommended)

### Alternative Deployment Options
- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` branch
- **Docker**: Use provided Dockerfile

## 🐛 Troubleshooting

### Common Issues
1. **500 Internal Server Error**
   - Check if URL Rewrite module is installed
   - Try removing `web.config` for basic static serving
   - Verify file permissions

2. **Network Tools Not Working**
   - Check browser console for CORS errors
   - Verify internet connectivity
   - Check API rate limits

3. **JSON Auto-Fix Issues**
   - Ensure input is valid JSON-like text
   - Check for unsupported syntax patterns
   - Try manual formatting first

### Debug Mode
Enable detailed error reporting by setting `errorMode="Detailed"` in `web.config` for development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and formatting
- Add tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness
- Test across different browsers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google DNS API** - Reliable DNS lookups
- **SSL Labs** - Comprehensive SSL analysis
- **React Team** - Amazing frontend framework
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/json-converter/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/json-converter/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/json-converter/discussions)

---

**Built with ❤️ for developers who need powerful tools at their fingertips.**

*Last updated: September 2024*
