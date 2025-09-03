# 🎯 IIS Deployment Summary - utils.redhot.com.au

## 📦 **Files Ready for Upload**

Your `dist/` folder contains **6 files** (280 KB total):

```
📁 dist/
├── 📄 index.html (8 KB)
├── 📄 web.config (8 KB) ← IIS + Let's Encrypt configuration
├── 📁 assets/
│   ├── 🎨 index-61bdac62.css (23.4 KB)
│   └── ⚡ index-c99027e9.js (180 KB)
└── 📁 .well-known/
    └── 📁 acme-challenge/
        └── 📄 test-token (26 bytes) ← Let's Encrypt support
```

## 🚀 **Quick Upload Steps**

### **Option 1: Plesk File Manager**
1. **Login to Plesk**
2. **Go to** `Domains` → `redhot.com.au`
3. **Create subdomain** `utils` (if not exists)
4. **Open File Manager** for `utils.redhot.com.au`
5. **Upload all files** from `dist/` folder
6. **Ensure `web.config`** is in the root directory

### **Option 2: FTP Upload**
```
Host: your-server-ip
Username: your-plesk-username  
Password: your-plesk-password
Remote directory: /httpdocs/utils/
Local directory: ./dist/
```

## ⚙️ **Plesk Configuration Checklist**

### **Required Settings**
- ✅ **Subdomain created**: `utils.redhot.com.au`
- ✅ **Document root**: `httpdocs/utils`
- ✅ **URL Rewrite module**: Installed (for web.config)
- ✅ **Let's Encrypt SSL**: Supported via ACME challenges

### **Performance Settings**
- ✅ **Gzip compression**: Enabled
- ✅ **Static file caching**: 1 year
- ✅ **Browser caching**: Enabled

## 🔧 **IIS Features Configured**

### **web.config Includes**
- ✅ **Let's Encrypt Support** - ACME challenge paths whitelisted
- ✅ **URL Rewrite rules** - SPA routing (excludes ACME)
- ✅ **Compression** - Gzip for all assets
- ✅ **Security headers** - XSS, CSP, etc.
- ✅ **Cache headers** - 1 year for static files
- ✅ **HTTPS redirect** - Force secure connections (except ACME)
- ✅ **MIME types** - JSON, fonts, etc.
- ✅ **WebDAV disabled** - Security enhancement

### **Let's Encrypt SSL Support**
- ✅ **ACME Challenge Path**: `.well-known/acme-challenge/*`
- ✅ **HTTP Access**: ACME tokens accessible via HTTP
- ✅ **No Redirects**: ACME paths bypass HTTPS redirect
- ✅ **Static Serving**: Tokens served as plain text
- ✅ **Security**: WebDAV disabled to prevent conflicts

## 🎯 **Expected Results**

### **After Upload**
- **URL**: https://utils.redhot.com.au
- **Load Time**: < 2 seconds
- **File Size**: 60 KB (gzipped)
- **Performance**: 95+ Lighthouse score
- **SSL**: Let's Encrypt certificate support

### **Features Available**
- 📄 **JSON Tools**: Format, validate, convert, RevenueCat extraction
- 🌐 **Network Tools**: DNS, ping, SSL, ports, email diagnostics
- 🎨 **Dark/Light Mode**: Theme switching
- 📱 **Mobile Responsive**: Works on all devices

## 🔒 **Security Features**

### **Automatic Protection**
- ✅ **HTTPS redirect** - All traffic encrypted (except ACME)
- ✅ **XSS protection** - Cross-site scripting prevention
- ✅ **Content Security Policy** - Resource restrictions
- ✅ **Frame protection** - Clickjacking prevention
- ✅ **WebDAV disabled** - Prevents unauthorized access

### **Let's Encrypt Security**
- ✅ **ACME challenges** - Secure certificate validation
- ✅ **HTTP access** - Required for certificate verification
- ✅ **Path isolation** - ACME paths don't affect app routing
- ✅ **Token protection** - Served as static files only

### **Network Tools Security**
- ✅ **HTTPS APIs** - All external calls secure
- ✅ **CORS configured** - Proper cross-origin handling
- ✅ **No data storage** - Client-side only

## 🚀 **Go Live Checklist**

### **Pre-Upload**
- ✅ **Build completed** successfully
- ✅ **web.config** copied to dist/ (with Let's Encrypt support)
- ✅ **ACME challenge directory** created
- ✅ **All files** present in dist/

### **Post-Upload**
- ✅ **Files uploaded** to correct directory
- ✅ **Subdomain accessible** at utils.redhot.com.au
- ✅ **Let's Encrypt SSL** working (if using)
- ✅ **HTTPS working** (if SSL configured)
- ✅ **App loads** without errors
- ✅ **JSON tools** functional
- ✅ **Network tools** functional
- ✅ **Dark mode** toggle working
- ✅ **Mobile responsive** design

## 📞 **Troubleshooting**

### **Common Issues**
1. **404 Errors** → Check web.config and URL Rewrite module
2. **500 Errors** → Check web.config syntax and file permissions
3. **SSL Issues** → Verify Let's Encrypt ACME challenges accessible
4. **Slow Loading** → Enable compression in Plesk

### **Let's Encrypt Issues**
1. **ACME Challenge Fails** → Ensure `.well-known/acme-challenge/` accessible via HTTP
2. **SSL Not Working** → Check certificate covers subdomain
3. **WebDAV Conflicts** → Verify WebDAV disabled in web.config

### **Support**
- **Plesk Logs**: Check error logs in Plesk
- **IIS Logs**: Review IIS application logs
- **File Permissions**: Ensure readable by IIS user
- **ACME Testing**: Test ACME challenge path accessibility

## 🎉 **Ready to Deploy!**

Your JSON Converter & Network Tools app is ready for IIS deployment with Let's Encrypt SSL support!

**Next Steps:**
1. **Upload dist/ folder** to utils.redhot.com.au
2. **Configure Let's Encrypt SSL** in Plesk (if desired)
3. **Test the app** at https://utils.redhot.com.au
4. **Share the URL** with your team/users
5. **Monitor performance** and gather feedback

**Your app will be live at: https://utils.redhot.com.au**

🚀 **Happy deploying!**
