# 🔧 IIS Troubleshooting Guide

## 🚨 **"Internal Server Error" Solutions**

### **Quick Fix Steps**

1. **Try the Simple Configuration**
   ```bash
   # Replace web.config with simplified version
   cp web.config.simple dist/web.config
   ```

2. **Check URL Rewrite Module**
   - Ensure URL Rewrite module is installed in IIS
   - Contact your hosting provider if not available

3. **Verify File Permissions**
   - Ensure IIS user has read access to all files
   - Check file permissions in Plesk File Manager

### **Common Error Causes**

#### **1. Missing URL Rewrite Module**
**Error**: `500.19 - Internal Server Error`
**Solution**: Install URL Rewrite module or use `web.config.simple`

#### **2. Invalid web.config Syntax**
**Error**: `500.19 - Configuration Error`
**Solution**: Use the simplified configuration

#### **3. File Permission Issues**
**Error**: `500.19 - Access Denied`
**Solution**: Set proper file permissions (readable by IIS)

#### **4. Missing MIME Types**
**Error**: Files not loading properly
**Solution**: Ensure MIME types are configured

## 🔍 **Diagnostic Steps**

### **Step 1: Test Basic Configuration**
1. **Upload `web.config.simple`** instead of `web.config`
2. **Test the site** - should work without advanced features
3. **If it works**, the issue is with advanced features

### **Step 2: Check IIS Logs**
1. **Plesk** → `Domains` → `redhot.com.au` → `utils`
2. **Logs** → `Error Logs`
3. **Look for specific error messages**

### **Step 3: Test File Access**
1. **Try accessing** `https://utils.redhot.com.au/index.html` directly
2. **If it works**, the issue is with URL Rewrite
3. **If it fails**, the issue is with file permissions

### **Step 4: Check Module Availability**
1. **Plesk** → `Tools & Settings` → `Server Management`
2. **IIS** → Check if URL Rewrite module is available
3. **If not available**, use `web.config.simple`

## 🛠️ **Configuration Options**

### **Option 1: Full Configuration (Recommended)**
```bash
# Use the complete web.config with all features
cp web.config dist/web.config
```
**Features**: Let's Encrypt SSL, compression, security headers, caching

### **Option 2: Simple Configuration (Fallback)**
```bash
# Use simplified web.config for basic compatibility
cp web.config.simple dist/web.config
```
**Features**: Basic SPA routing, security headers, no advanced features

### **Option 3: No Configuration (Basic)**
```bash
# Remove web.config entirely
rm dist/web.config
```
**Features**: Basic static file serving only

## 📋 **Deployment Checklist**

### **Pre-Upload Testing**
- ✅ **Local build** works (`npm run build`)
- ✅ **Local serve** works (`npm run serve`)
- ✅ **All files** present in `dist/`

### **Upload Testing**
- ✅ **Files uploaded** successfully
- ✅ **File permissions** correct
- ✅ **No upload errors**

### **Post-Upload Testing**
- ✅ **Site accessible** at utils.redhot.com.au
- ✅ **No 500 errors**
- ✅ **App loads** correctly
- ✅ **Features work** (JSON tools, Network tools)

## 🚀 **Quick Recovery Steps**

### **If Site is Down**
1. **Upload `web.config.simple`** as `web.config`
2. **Test the site**
3. **If it works**, gradually add features back

### **If Features Don't Work**
1. **Check browser console** for JavaScript errors
2. **Verify all assets** loaded correctly
3. **Test network tools** with simple domains

### **If SSL Issues**
1. **Test HTTP** first (http://utils.redhot.com.au)
2. **Check SSL certificate** configuration
3. **Verify ACME challenges** accessible

## 📞 **Support Information**

### **Error Log Locations**
- **Plesk Error Logs**: `Domains` → `redhot.com.au` → `utils` → `Logs`
- **IIS Application Logs**: Windows Event Viewer
- **Browser Console**: F12 → Console tab

### **Common Error Messages**
- `500.19` → Configuration error
- `500.50` → URL Rewrite module missing
- `404.0` → File not found
- `403.14` → Directory browsing disabled

### **Contact Information**
- **Hosting Provider**: For URL Rewrite module installation
- **Plesk Support**: For Plesk-specific issues
- **IIS Documentation**: Microsoft IIS documentation

## 🎯 **Success Indicators**

### **Working Configuration**
- ✅ **Site loads** without errors
- ✅ **JSON tools** functional
- ✅ **Network tools** functional
- ✅ **Dark mode** toggle works
- ✅ **Mobile responsive** design

### **Performance Indicators**
- ✅ **Load time** < 3 seconds
- ✅ **No console errors**
- ✅ **All assets** loaded
- ✅ **SSL working** (if configured)

## 🔄 **Configuration Testing**

### **Test Each Feature**
1. **Basic SPA routing** - navigate to different sections
2. **JSON formatting** - paste and format JSON
3. **Network tools** - test DNS lookup
4. **Dark mode** - toggle theme
5. **Mobile view** - test responsive design

### **Monitor Performance**
- **Page load time**
- **Asset loading**
- **JavaScript execution**
- **Network requests**

🎉 **Your app should work perfectly with the right configuration!**
