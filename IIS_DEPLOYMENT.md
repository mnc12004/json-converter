# 🚀 IIS + Plesk Deployment Guide

## 📋 Prerequisites

- ✅ Plesk access for `redhot.com.au`
- ✅ Subdomain `utils.redhot.com.au` created
- ✅ SSL certificate configured (recommended)

## 📦 Files to Upload

Upload these files to your `utils.redhot.com.au` document root:

```
📁 Document Root (utils.redhot.com.au)
├── 📄 index.html
├── 📄 web.config (IIS configuration)
└── 📁 assets/
    ├── 🎨 index-61bdac62.css
    └── ⚡ index-c99027e9.js
```

## 🚀 Deployment Steps

### 1. **Prepare Files**
```bash
# Your production build is ready in dist/
# Copy web.config to dist folder
cp web.config dist/
```

### 2. **Upload via Plesk File Manager**
1. **Login to Plesk**
2. **Navigate to** `Domains` → `redhot.com.au` → `File Manager`
3. **Create subdomain folder** (if not exists): `utils`
4. **Upload all files** from `dist/` to `utils/` folder

### 3. **Upload via FTP/SFTP**
```bash
# Using FTP client (FileZilla, WinSCP, etc.)
Host: your-server-ip
Username: your-plesk-username
Password: your-plesk-password
Remote directory: /httpdocs/utils/
Local directory: ./dist/
```

### 4. **Upload via Command Line**
```bash
# Using scp (if SSH access available)
scp -r dist/* username@your-server:/var/www/vhosts/redhot.com.au/utils/
```

## ⚙️ Plesk Configuration

### 1. **Create Subdomain** (if not exists)
1. **Plesk** → `Domains` → `redhot.com.au`
2. **Subdomains** → `Add Subdomain`
3. **Name**: `utils`
4. **Document root**: `httpdocs/utils`

### 2. **Enable URL Rewrite Module**
1. **Plesk** → `Tools & Settings` → `Server Management`
2. **IIS** → `URL Rewrite Module`
3. **Ensure it's installed** (required for web.config)

### 3. **Configure SSL** (Recommended)
1. **Plesk** → `Domains` → `redhot.com.au`
2. **SSL/TLS Certificates**
3. **Add certificate** for `*.redhot.com.au` or `utils.redhot.com.au`

### 4. **Performance Settings**
1. **Plesk** → `Domains` → `redhot.com.au` → `utils`
2. **Apache & nginx Settings**
3. **Enable**:
   - ✅ Gzip compression
   - ✅ Browser caching
   - ✅ Static file caching

## 🔧 Troubleshooting

### **404 Errors**
- Ensure `web.config` is uploaded
- Check URL Rewrite module is installed
- Verify file permissions (readable by IIS)

### **500 Errors**
- Check `web.config` syntax
- Review IIS error logs
- Ensure all files uploaded correctly

### **SSL Issues**
- Verify SSL certificate is valid
- Check certificate covers subdomain
- Ensure HTTPS redirect is working

## 📊 Performance Optimization

### **IIS Settings**
- ✅ **Compression enabled** (gzip)
- ✅ **Static file caching** (1 year)
- ✅ **Security headers** configured
- ✅ **URL Rewrite** for SPA routing

### **Expected Performance**
- **Page Load**: < 2 seconds
- **Lighthouse Score**: 95+
- **File Size**: 60 KB (gzipped)

## 🔒 Security Features

### **Security Headers**
- ✅ **X-Frame-Options**: SAMEORIGIN
- ✅ **X-Content-Type-Options**: nosniff
- ✅ **X-XSS-Protection**: 1; mode=block
- ✅ **Content-Security-Policy**: Configured
- ✅ **HTTPS Redirect**: Enabled

### **Network Tools Security**
- ✅ **HTTPS required** for all API calls
- ✅ **CORS configured** for external APIs
- ✅ **No sensitive data** stored client-side

## 🎯 Final Checklist

- ✅ **Files uploaded** to correct directory
- ✅ **web.config** in document root
- ✅ **SSL certificate** configured
- ✅ **URL Rewrite** module installed
- ✅ **File permissions** correct
- ✅ **Subdomain** accessible
- ✅ **HTTPS redirect** working
- ✅ **App functionality** tested

## 🚀 Go Live!

Your app will be available at:
**https://utils.redhot.com.au**

### **Test Your Deployment**
1. **Visit** https://utils.redhot.com.au
2. **Test JSON tools** - paste some JSON and format it
3. **Test Network tools** - try DNS lookup for `google.com`
4. **Test Dark mode** - toggle theme
5. **Test mobile** - check responsive design

## 📞 Support

If you encounter issues:
1. **Check Plesk error logs**
2. **Verify file permissions**
3. **Test with simple HTML file first**
4. **Contact your hosting provider**

🎉 **Your JSON Converter & Network Tools will be live at utils.redhot.com.au!**
