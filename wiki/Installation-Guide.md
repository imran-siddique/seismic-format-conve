# 📋 Installation Guide

Get the Seismic Format Converter up and running on your local machine in just a few minutes.

## 🚀 Quick Start

### **Prerequisites**

Before you begin, ensure you have the following installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | ≥ 18.0.0 | JavaScript runtime |
| **npm** | ≥ 9.0.0 | Package manager |
| **Git** | ≥ 2.30.0 | Version control |

> **💡 Tip**: Use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions

### **System Requirements**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 1 GB free | 5 GB+ |
| **Browser** | Chrome 90+ | Chrome/Firefox latest |
| **CPU** | 2 cores | 4+ cores |

## 📦 Installation Steps

### **1. Clone the Repository**

```bash
# Using HTTPS
git clone https://github.com/imran-siddique/seismic-format-conve.git

# Using SSH (recommended for contributors)
git clone git@github.com:imran-siddique/seismic-format-conve.git

# Navigate to project directory
cd seismic-format-conve
```

### **2. Install Dependencies**

```bash
# Install all packages
npm install

# Verify installation
npm list --depth=0
```

**Expected output:**
```
seismic-format-conve@0.0.0
├── @github/spark@0.0.1
├── @radix-ui/react-*@various
├── react@19.0.0
├── typescript@5.7.2
└── vite@6.3.5
```

### **3. Start Development Server**

```bash
# Start the development server
npm run dev

# Alternative: Kill any existing process first
npm run kill && npm run dev
```

**Success indicators:**
```
✓ Local:   http://localhost:5173/
✓ Network: http://192.168.1.xxx:5173/
✓ Spark ready for development
```

### **4. Verify Installation**

1. **Open your browser** to `http://localhost:5173`
2. **Upload a test file** (any file will work for testing)
3. **Check format detection** works correctly
4. **Verify UI components** load properly

## 🛠️ Development Setup

### **Editor Configuration**

#### **VS Code (Recommended)**

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

**Recommended Extensions:**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### **Environment Variables**

Create `.env.local` (optional):
```bash
# Development settings
VITE_DEV_MODE=true
VITE_DEBUG_CONVERSION=true

# Azure integration (optional)
VITE_AZURE_CLIENT_ID=your_client_id
VITE_AZURE_TENANT_ID=your_tenant_id

# Performance monitoring (optional)
VITE_ENABLE_ANALYTICS=false
```

### **Git Configuration**

```bash
# Set up git hooks (optional)
npm run prepare

# Configure git for the project
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 🏗️ Build Process

### **Development Build**

```bash
# Watch mode with hot reload
npm run dev

# Check TypeScript types
npm run type-check

# Lint code
npm run lint
```

### **Production Build**

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Serve on specific port
npm run preview -- --port 4173
```

**Build output structure:**
```
dist/
├── assets/
│   ├── index-[hash].js      # Main application bundle
│   ├── index-[hash].css     # Styles
│   └── vendor-[hash].js     # Third-party libraries
├── index.html               # Entry point
└── favicon.ico             # Application icon
```

### **Build Analysis**

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Check for duplicate dependencies
npm run build -- --mode bundle-analyzer
```

## 🐳 Docker Installation

### **Using Docker Compose (Recommended)**

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  seismic-converter:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./public:/usr/share/nginx/html/public:ro
```

Run with Docker:
```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

### **Direct Docker Usage**

```bash
# Build Docker image
docker build -t seismic-converter .

# Run container
docker run -p 3000:80 seismic-converter

# Run with volume mounting
docker run -p 3000:80 -v $(pwd)/data:/app/data seismic-converter
```

## ☁️ Cloud Deployment

### **Vercel Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Netlify Deployment**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### **Azure Static Web Apps**

Create `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

## 🔧 Troubleshooting Installation

### **Common Issues**

#### **Node.js Version Issues**
```bash
# Check Node.js version
node --version

# Install correct version with nvm
nvm install 18
nvm use 18
```

#### **Package Installation Failures**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Permission Errors (Linux/macOS)**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### **Port Already in Use**
```bash
# Find process using port 5173
lsof -ti:5173

# Kill the process
kill -9 $(lsof -ti:5173)

# Or use different port
npm run dev -- --port 3000
```

#### **TypeScript Compilation Errors**
```bash
# Check TypeScript version
npx tsc --version

# Reinstall TypeScript
npm install typescript@latest
```

### **Performance Issues**

#### **Slow Build Times**
```bash
# Enable parallel processing
npm run build -- --parallel

# Use faster builds in development
npm run dev -- --fast-build
```

#### **Memory Issues**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## 📊 Verification Checklist

After installation, verify these components work:

- [ ] **Application loads** at `http://localhost:5173`
- [ ] **File upload** accepts files via drag & drop
- [ ] **Format detection** identifies file types correctly
- [ ] **UI components** render without errors
- [ ] **TypeScript compilation** has no errors
- [ ] **Linting** passes without warnings
- [ ] **Hot reload** works during development
- [ ] **Production build** creates dist/ folder
- [ ] **Preview mode** serves production build

## 🆘 Getting Help

If you encounter issues during installation:

1. **Check the [Troubleshooting Guide](Troubleshooting.md)**
2. **Search [existing issues](https://github.com/imran-siddique/seismic-format-conve/issues)**
3. **Create a new issue** with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error message
   - Steps to reproduce

---

## 🎯 Next Steps

After successful installation:

1. **[Quick Start Guide](Quick-Start.md)** - Learn basic usage
2. **[Examples & Usage](Examples-and-Usage.md)** - See practical examples
3. **[Contributing Guide](Contributing.md)** - Start contributing
4. **[API Reference](API-Reference.md)** - Explore the codebase

---

*Ready to convert seismic data? Your development environment is now set up and ready to go!*