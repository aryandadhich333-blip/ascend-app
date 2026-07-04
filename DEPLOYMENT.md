# ASCEND - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- GitHub repository set up
- Cloud hosting account (Heroku, Vercel, AWS, etc.)
- MongoDB Atlas account (or self-hosted MongoDB)
- OpenAI API key

---

## Option 1: Heroku + Vercel (Recommended for Beginners)

### Backend Deployment (Heroku)

#### 1. Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
choco install heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Create Heroku App
```bash
heroku login
cd backend
heroku create ascend-api
```

#### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret_here
heroku config:set OPENAI_API_KEY=sk-your-key-here
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ascend
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

#### 4. Deploy
```bash
git push heroku main
```

#### 5. View Logs
```bash
heroku logs --tail
```

**Backend URL:** `https://ascend-api.herokuapp.com`

### Frontend Deployment (Vercel)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel
```

#### 3. Follow Prompts
- Link to GitHub
- Set project name: `ascend`
- Select "React" framework
- Build command: `npm run build`
- Output directory: `dist`

#### 4. Set Environment Variables
In Vercel Dashboard:
```
VITE_API_URL=https://ascend-api.herokuapp.com/api
```

**Frontend URL:** Will be provided by Vercel

---

## Option 2: AWS Deployment

### Backend (EC2 + RDS)

#### 1. Create EC2 Instance
```bash
# Ubuntu 20.04 LTS t2.micro (free tier eligible)
# Security group: Allow ports 80, 443, 5000
```

#### 2. Connect & Setup
```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### 3. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/ascend-app.git
cd ascend-app/backend
npm install
```

#### 4. Create .env
```bash
# Copy your environment variables
sudo nano .env
```

#### 5. Start with PM2
```bash
pm2 start npm --name "ascend-backend" -- start
pm2 startup
pm2 save
```

#### 6. Setup Nginx Reverse Proxy
```bash
sudo apt install nginx -y
sudo systemctl start nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80 default_server;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Frontend (S3 + CloudFront)

#### 1. Create S3 Bucket
```bash
# Using AWS CLI
aws s3 mb s3://ascend-frontend
```

#### 2. Build & Upload
```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://ascend-frontend --delete
```

#### 3. Setup CloudFront
- Create distribution pointing to S3 bucket
- Set default root to `index.html`
- Add SSL certificate

---

## Option 3: Digital Ocean Deployment

### Using Docker (Recommended)

#### 1. Create Droplet
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- Enable SSH key authentication

#### 2. Install Docker
```bash
ssh root@your-droplet-ip

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 3. Clone & Deploy
```bash
git clone https://github.com/YOUR_USERNAME/ascend-app.git
cd ascend-app

# Edit docker-compose.yml for production
nano docker-compose.yml

# Start services
docker-compose up -d
```

#### 4. Setup Domain
- Point your domain to droplet IP
- Update `CORS_ORIGIN` in backend .env

#### 5. SSL Certificate
```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d your-domain.com
```

---

## Database Setup

### MongoDB Atlas (Cloud)

#### 1. Create Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up and create organization

#### 2. Create Cluster
- Choose cloud provider (AWS, Azure, Google Cloud)
- Select free tier (M0)
- Wait for cluster to initialize

#### 3. Get Connection String
- Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your password

#### 4. Update .env
```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/ascend
```

### Self-Hosted MongoDB

#### Installation
```bash
# Ubuntu
sudo apt-get install -y mongodb

# Start service
sudo systemctl start mongodb
```

#### Create Database & User
```bash
mongosh

use ascend
db.createUser({
  user: "ascend_user",
  pwd: "strong_password_here",
  roles: [{ role: "readWrite", db: "ascend" }]
})
```

---

## CI/CD Pipeline (GitHub Actions)

### Auto-Deploy on Push

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ASCEND

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          cd backend
          git push https://heroku:$HEROKU_API_KEY@git.heroku.com/ascend-api.git main

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          cd frontend
          npm run build
          vercel --prod --token $VERCEL_TOKEN
```

### Setup Secrets
1. Go to GitHub repo Settings
2. Click "Secrets and variables" → "Actions"
3. Add:
   - `HEROKU_API_KEY` - From Heroku account
   - `VERCEL_TOKEN` - From Vercel account

---

## Production Environment Variables

### Backend .env
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ascend
JWT_SECRET=very_long_random_string_at_least_32_chars
JWT_EXPIRY=7d
OPENAI_API_KEY=sk-your-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend .env
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_ENV=production
```

---

## Monitoring & Logging

### Heroku
```bash
# View logs
heroku logs --tail

# View metrics
heroku metrics
```

### Self-Hosted
```bash
# PM2 logs
pm2 logs ascend-backend

# View PM2 dashboard
pm2 monit
```

### Application Monitoring
- [Sentry](https://sentry.io) - Error tracking
- [DataDog](https://datadog.com) - APM
- [New Relic](https://newrelic.com) - Performance monitoring

---

## Backup & Recovery

### Database Backup (MongoDB Atlas)
- Automatic daily backups included
- 7-day retention
- Restore from Backup tab in Atlas

### Manual Backup
```bash
# Export database
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/ascend" --out ./backup

# Import database
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/ascend" ./backup
```

---

## Cost Optimization

### Free/Cheap Services
- **Heroku** - $7/month (eco dyno)
- **Vercel** - Free tier available
- **MongoDB Atlas** - Free tier (512MB)
- **CloudFlare** - Free SSL + DNS
- **GitHub** - Free public repos

### Estimated Monthly Cost
- Backend: $7 (Heroku)
- Frontend: $0 (Vercel free)
- Database: $0 (Atlas free)
- Domain: ~$1 (Namecheap)
- **Total: ~$8/month**

---

## Post-Deployment

### 1. Testing
```bash
# Test API endpoints
curl https://your-api-domain.com/api/health

# Test frontend
Visit https://your-frontend-domain.com
```

### 2. Performance
- Check Core Web Vitals
- Optimize images
- Enable caching headers
- Use CDN

### 3. Security
- Enable HTTPS everywhere
- Set security headers
- Regular security audits
- Keep dependencies updated

### 4. Monitoring
- Setup error tracking (Sentry)
- Monitor uptime (Uptime Robot)
- Track performance (DataDog)
- Log aggregation (LogRocket)

---

## Troubleshooting

### Database Connection Error
```
MongoNetworkError: connect ECONNREFUSED
```
**Solution:** Check MongoDB URI and whitelist IP

### CORS Error on Production
**Solution:** Update `CORS_ORIGIN` to match frontend domain

### High Memory Usage
**Solution:** Increase instance size or optimize code

### Slow API Response
**Solution:** Add caching, optimize queries, scale horizontally

---

## Rollback Strategy

### Heroku
```bash
heroku releases
heroku rollback v10
```

### Git
```bash
git revert <commit-hash>
git push
```

---

## Support & Resources

- 📖 [Heroku Docs](https://devcenter.heroku.com)
- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- 📖 [AWS Docs](https://docs.aws.amazon.com)
- 📖 [DigitalOcean Docs](https://docs.digitalocean.com)

---

**Happy deploying! 🚀 Your ASCEND app is live!**
