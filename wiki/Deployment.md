# 🚀 Deployment Guide

Complete guide to deploying the Seismic Format Converter in different environments, from local development to enterprise cloud deployments.

## 🎯 Deployment Options

| Environment | Complexity | Use Case | Scalability |
|-------------|------------|----------|-------------|
| **Local Development** | ⭐ Simple | Development, testing | Single user |
| **Static Hosting** | ⭐⭐ Easy | Small teams, demos | Low traffic |
| **Docker Container** | ⭐⭐⭐ Medium | Production, scaling | Medium traffic |
| **Kubernetes** | ⭐⭐⭐⭐ Advanced | Enterprise, high availability | High traffic |
| **Azure Static Apps** | ⭐⭐ Easy | Cloud-native, Azure integration | Auto-scaling |

## 🖥️ Local Development

### **Development Server**

```bash
# Clone and setup
git clone https://github.com/imran-siddique/seismic-format-conve.git
cd seismic-format-conve

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### **Production Build Locally**

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve on custom port
npm run preview -- --port 4000
```

## ☁️ Static Hosting Deployments

### **Vercel Deployment**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "app/api/**/*": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **Netlify Deployment**

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Content-Type = "application/javascript"

[[headers]]
  for = "*.css"
  [headers.values]
    Content-Type = "text/css"
```

### **GitHub Pages Deployment**

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

## 🐳 Docker Deployments

### **Basic Docker Setup**

**Dockerfile**:
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add labels
LABEL maintainer="seismic-converter-team"
LABEL version="1.0"
LABEL description="Seismic Format Converter"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration** (`nginx.conf`):
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### **Docker Compose**

**Development** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  seismic-converter-dev:
    build:
      context: .
      target: builder
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev -- --host 0.0.0.0
```

**Production** (`docker-compose.prod.yml`):
```yaml
version: '3.8'

services:
  seismic-converter:
    build:
      context: .
      target: production
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/ssl/certs:ro
    restart: unless-stopped
    
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - seismic-converter
    restart: unless-stopped

networks:
  default:
    driver: bridge
```

### **Running with Docker**

```bash
# Build the image
docker build -t seismic-converter .

# Run development container
docker-compose up

# Run production container
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## ☸️ Kubernetes Deployment

### **Kubernetes Manifests**

**Namespace** (`k8s/namespace.yaml`):
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: seismic-converter
  labels:
    name: seismic-converter
```

**Deployment** (`k8s/deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: seismic-converter
  namespace: seismic-converter
  labels:
    app: seismic-converter
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: seismic-converter
  template:
    metadata:
      labels:
        app: seismic-converter
    spec:
      containers:
      - name: seismic-converter
        image: seismic-converter:latest
        ports:
        - containerPort: 80
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: AZURE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: azure-secrets
              key: client-id
        - name: AZURE_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              name: azure-secrets
              key: client-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
      imagePullSecrets:
      - name: registry-secret
```

**Service** (`k8s/service.yaml`):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: seismic-converter-service
  namespace: seismic-converter
  labels:
    app: seismic-converter
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
    name: http
  selector:
    app: seismic-converter
```

**Ingress** (`k8s/ingress.yaml`):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: seismic-converter-ingress
  namespace: seismic-converter
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - seismic.yourdomain.com
    secretName: seismic-converter-tls
  rules:
  - host: seismic.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: seismic-converter-service
            port:
              number: 80
```

**ConfigMap** (`k8s/configmap.yaml`):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: seismic-converter
data:
  nginx.conf: |
    events {
        worker_connections 1024;
    }
    http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        
        server {
            listen 80;
            root /usr/share/nginx/html;
            index index.html;
            
            location / {
                try_files $uri $uri/ /index.html;
            }
            
            location /health {
                access_log off;
                return 200 "healthy\n";
                add_header Content-Type text/plain;
            }
        }
    }
```

**Secrets** (`k8s/secrets.yaml`):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-secrets
  namespace: seismic-converter
type: Opaque
data:
  client-id: <base64-encoded-client-id>
  client-secret: <base64-encoded-client-secret>
  tenant-id: <base64-encoded-tenant-id>
```

### **Deploying to Kubernetes**

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n seismic-converter

# View logs
kubectl logs -f deployment/seismic-converter -n seismic-converter

# Scale deployment
kubectl scale deployment seismic-converter --replicas=5 -n seismic-converter

# Update deployment
kubectl set image deployment/seismic-converter seismic-converter=seismic-converter:v2.0.0 -n seismic-converter

# Rolling restart
kubectl rollout restart deployment/seismic-converter -n seismic-converter
```

## ☁️ Azure Static Web Apps

### **Azure Static Web Apps Configuration**

**Configuration** (`staticwebapp.config.json`):
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {
    "401": {
      "redirect": "/login",
      "statusCode": 302
    },
    "403": {
      "redirect": "/unauthorized",
      "statusCode": 302
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'"
  }
}
```

**GitHub Actions** (`.github/workflows/azure-static-web-apps.yml`):
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
        env:
          NODE_VERSION: "18"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## 🔧 Environment Configuration

### **Environment Variables**

**Development** (`.env.development`):
```bash
# Development settings
NODE_ENV=development
VITE_APP_NAME=Seismic Format Converter
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true

# Azure settings (optional for development)
VITE_AZURE_CLIENT_ID=dev-client-id
VITE_AZURE_TENANT_ID=dev-tenant-id
```

**Production** (`.env.production`):
```bash
# Production settings
NODE_ENV=production
VITE_APP_NAME=Seismic Format Converter
VITE_API_URL=https://api.seismic-converter.com
VITE_DEBUG=false

# Azure settings
VITE_AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
VITE_AZURE_TENANT_ID=${AZURE_TENANT_ID}
VITE_AZURE_EDS_ENDPOINT=${AZURE_EDS_ENDPOINT}

# Analytics
VITE_GOOGLE_ANALYTICS_ID=${GA_ID}
VITE_HOTJAR_ID=${HOTJAR_ID}
```

### **Build Configuration**

**Package.json Scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "preview:network": "vite preview --host",
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "analyze": "npx vite-bundle-analyzer"
  }
}
```

## 📊 Monitoring and Observability

### **Application Monitoring**

**Health Check Endpoint**:
```typescript
// src/health.ts
export const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: process.env.VITE_APP_VERSION || '1.0.0',
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  environment: process.env.NODE_ENV
}
```

**Performance Monitoring**:
```typescript
// src/monitoring.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric)
}

// Measure Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### **Logging Configuration**

```typescript
// src/logger.ts
export class Logger {
  private static instance: Logger
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }
  
  info(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data)
    }
    this.sendToService('info', message, data)
  }
  
  error(message: string, error?: Error, data?: any) {
    console.error(`[ERROR] ${message}`, error, data)
    this.sendToService('error', message, { error: error?.message, ...data })
  }
  
  private sendToService(level: string, message: string, data?: any) {
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Azure Application Insights)
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message, data, timestamp: Date.now() })
      }).catch(err => console.error('Failed to send log:', err))
    }
  }
}
```

## 🔒 Security Considerations

### **Content Security Policy**

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.seismic-converter.com;
  worker-src 'self' blob:;
">
```

### **Environment Security**

```bash
# Production security checklist
- [ ] Remove development dependencies
- [ ] Use HTTPS only
- [ ] Set secure headers
- [ ] Enable CSRF protection
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable audit logging
- [ ] Implement access controls
```

## 🎯 Performance Optimization

### **Build Optimization**

```typescript
// vite.config.ts optimization
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-alert-dialog', '@radix-ui/react-button'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### **CDN Configuration**

```yaml
# CloudFlare configuration
cache_rules:
  - pattern: "*.js"
    cache_level: cache_everything
    ttl: 31536000  # 1 year
  - pattern: "*.css"
    cache_level: cache_everything
    ttl: 31536000  # 1 year
  - pattern: "*.woff2"
    cache_level: cache_everything
    ttl: 31536000  # 1 year
```

---

## 🎯 Next Steps

After deployment:

1. **[Monitor Performance](Troubleshooting.md#monitoring)** - Set up monitoring and alerts
2. **[Configure Analytics](Examples-and-Usage.md#analytics)** - Track usage and performance
3. **[Set up CI/CD](Contributing.md#automation)** - Automate deployments
4. **[Scale Infrastructure](Architecture.md#scalability)** - Plan for growth

---

*Your Seismic Format Converter is now ready for production! From simple static hosting to enterprise Kubernetes deployments — choose the option that best fits your needs.*