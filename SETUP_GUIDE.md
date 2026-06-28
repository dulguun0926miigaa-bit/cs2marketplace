# CS2 Skin Marketplace - Complete Setup & Deployment Guide

## 📋 Overview

The marketplace now has **30 CS2 cases** with **SkinsMonkey-style** UI, Steam integration, and full case opening functionality.

## ✨ What's New

✅ **30 CS2 Cases** - Dreams & Nightmares, Recoil, Revolution, Kilowatt, Snakebite, Riptide, Fracture, Prisma 2, Ancient, Clutch, Op Riptide, Shattered Web, CS20, Broken Fang, Spectrum 2, Conquer, Classified, Vertigo, Inferno, Mirage, Nuke, Dust 2, Cache, Overpass, Cobblestone, Phoenix, Gamma, Gamma 2, Glove, Danger Zone

✅ **SkinsMonkey-Style UI** - Beautiful case cards with case illustration, skin preview, and "OPEN FOR $X" button

✅ **Case Opening Experience** - Spinning animation, win display, recent drops history

✅ **Steam Authentication** - Optional Steam account integration for future matchmaking

---

## 🚀 Quick Start (5 minutes)

### 1. **Install Dependencies**
```bash
cd duk-ochir
npm run install:all
```

### 2. **Start Infrastructure** (PostgreSQL, Redis, etc.)
```bash
npm run infra:up
```

### 3. **Run Everything Together**
```bash
npm run dev
```

This starts:
- Frontend (React) → `http://localhost:5173`
- API Gateway → `http://localhost:3000`
- Auth Service → `http://localhost:3001`
- Marketplace Service → `http://localhost:3002`
- Notification Service → `http://localhost:3003`

---

## 🔧 Detailed Setup Steps

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Step 1: Navigate to Project
```bash
cd duk-ochir
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

### Step 3: Start Database & Cache
```bash
npm run infra:up
```

Wait for services to be healthy:
```bash
docker compose -f docker-compose.infra.yml ps
```

### Step 4: Initialize Databases
```bash
npm run db:migrate
npm run db:seed
```

### Step 5: Start Development Servers
```bash
npm run dev
```

You'll see colored output for all services:
- **GATEWAY** (cyan)
- **AUTH** (yellow)
- **MARKET** (green)
- **NOTIFY** (magenta)
- **FRONTEND** (blue)

---

## 🎮 Testing the Marketplace

### 1. **Visit Cases Page**
```
http://localhost:5173/cases
```

You should see:
- ✅ Featured cases in hero section
- ✅ All 30 CS2 cases in a grid
- ✅ Beautiful SkinsMonkey-style cards
- ✅ "OPEN FOR $X" buttons

### 2. **Click on a Case**
```
http://localhost:5173/cases/dreams-nightmares
```

You should see:
- ✅ Case opening animation
- ✅ Case contents (30+ skins)
- ✅ "OPEN CASE" button
- ✅ Recent drops history

### 3. **Test Opening (Without Login)**
- Click "OPEN CASE" button
- You'll be prompted to log in

### 4. **Create Account & Test**
```
1. Click "Register"
2. Fill in username, email, password
3. Go back to cases
4. Click a case → Open it
5. See the random skin you won!
```

---

## 🌐 Steam Integration Setup

### Backend Configuration

**1. Create Steam API Key**
- Visit [Steam API Community](https://steamcommunity.com/dev/apikey)
- Generate API key
- Add to `.env`:
```env
STEAM_API_KEY=your_api_key_here
STEAM_RETURN_URL=http://localhost:5173/auth/steam/callback
```

**2. Add Steam Routes** (in `auth-service/src/routes`)

Create `steam.routes.js`:
```javascript
const express = require('express');
const router = express.Router();

router.post('/verify', async (req, res) => {
  // Verify Steam OpenID response
  // Exchange steamId for user profile
  // Create/update user account
  // Return JWT token
});

router.post('/connect', async (req, res) => {
  // Connect Steam account to existing user
});

router.post('/disconnect', async (req, res) => {
  // Disconnect Steam account
});

module.exports = router;
```

**3. Update Auth Controller**
```javascript
// In auth.controller.js
const handleSteamLogin = async (steamId, steamUsername) => {
  let user = await User.findOne({ steamId });
  
  if (!user) {
    user = await User.create({
      username: steamUsername,
      steamId,
      isVerified: true,
    });
  }
  
  const token = generateJWT(user.id);
  return { token, user };
};
```

### Frontend Configuration

**1. Add Steam Callback Page** (optional but recommended)

Create `frontend/src/pages/SteamCallbackPage.jsx`:
```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { steamService } from '../services/steam.service';

export default function SteamCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamId = params.get('openid.identity');
    const steamUsername = params.get('username');
    
    if (steamId) {
      steamService.handleSteamCallback(steamId, steamUsername)
        .then(() => navigate('/cases'))
        .catch(() => navigate('/login'));
    }
  }, [navigate]);

  return <div>Authenticating with Steam...</div>;
}
```

**2. Add Route in App.jsx**
```javascript
<Route path="/auth/steam/callback" element={<SteamCallbackPage />} />
```

**3. Add Login Button to LoginPage**
```javascript
import { SteamLoginButton } from '../services/steam.service';

// In LoginPage JSX:
<SteamLoginButton />
```

---

## 📊 Database Schema

The case opening system uses:

```prisma
model Case {
  id              Int
  name            String
  slug            String @unique
  description     String?
  price           Float
  isFeatured      Boolean
  caseItems       CaseItem[]
  openingHistory  CaseOpeningHistory[]
}

model CaseItem {
  id        Int
  caseId    Int
  skinId    Int
  dropRate  Float
  case      Case @relation(...)
  skin      Skin @relation(...)
}

model CaseOpeningHistory {
  id        Int
  userId    Int
  caseId    Int
  skinId    Int
  price     Float
  createdAt DateTime
}
```

---

## 🔌 API Endpoints

### Cases
```
GET /marketplace/cases                    # List all cases
GET /marketplace/cases/:slug              # Get case details
POST /marketplace/cases/:slug/open        # Open a case (user loses balance, gets random skin)
GET /marketplace/cases/history/me         # Get user's opening history
GET /marketplace/cases/stats/me           # Get user's statistics
```

### Example - Open Case
```bash
curl -X POST http://localhost:3000/marketplace/cases/dreams-nightmares/open \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "success": true,
  "data": {
    "won": {
      "id": 1,
      "name": "AK-47 | Redline",
      "rarity": "CLASSIFIED",
      "price": 45.99
    },
    "balance": 50.00
  }
}
```

---

## 📦 Deployment (Docker)

### Production Build
```bash
npm run docker:up
```

This creates containers for:
- Frontend (Nginx)
- API Gateway
- Auth Service
- Marketplace Service
- Notification Service
- PostgreSQL Database
- Redis Cache

### Environment Variables

Create `.env` file in root:
```env
# Database
DATABASE_URL=postgresql://user:password@postgres:5432/marketplace

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Steam API
STEAM_API_KEY=your_steam_api_key
STEAM_RETURN_URL=https://yourdomain.com/auth/steam/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# URLs
FRONTEND_URL=https://yourdomain.com
API_GATEWAY_URL=https://api.yourdomain.com
```

### Deploy to VPS
```bash
# SSH into server
ssh user@your-vps-ip

# Clone repo
git clone https://github.com/your-repo.git
cd duk-ochir

# Create .env file
nano .env
# Add your environment variables

# Start services
npm run docker:up

# Check logs
docker compose logs -f
```

---

## 🧪 Testing Checklist

- [ ] npm run dev starts all services without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Cases page shows 30 cases
- [ ] Can click on a case and see opening page
- [ ] Can create account and log in
- [ ] Can "open" a case after logging in
- [ ] Random skin is displayed
- [ ] Balance decreases by case price
- [ ] Recent drops show the opened skins
- [ ] Mobile responsive design works

---

## 🐛 Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :5173

# Kill process on specific port
kill -9 <PID>
```

### Database issues
```bash
# Reset database
npm run infra:down
npm run infra:up
npm run db:migrate
npm run db:seed
```

### Frontend not loading
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules frontend/node_modules
npm run install:all
```

### Check service health
```bash
# Check if containers are running
docker compose -f docker-compose.infra.yml ps

# View logs
docker compose -f docker-compose.infra.yml logs postgres
```

---

## 📝 File Structure

```
duk-ochir/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CasesPage.jsx              (✨ Updated - Shows 30 cases)
│   │   │   └── CaseOpeningPage.jsx        (✨ Case opening animation)
│   │   ├── components/case/
│   │   │   ├── SkinsMonkeyCaseCard.jsx    (✨ New - Card component)
│   │   │   └── CaseItemCard.jsx
│   │   ├── services/
│   │   │   ├── marketplace.service.js
│   │   │   └── steam.service.js           (✨ New - Steam auth)
│   │   └── store/
│   ├── App.jsx                            (✅ Routes already configured)
│   └── package.json
│
├── services/
│   └── marketplace-service/
│       ├── prisma/
│       │   ├── seed.js                    (✨ Updated - 30 cases + 30 skins each)
│       │   └── schema.prisma
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   └── routes/
│       └── package.json
│
├── package.json                           (✅ npm run dev configured)
├── docker-compose.yml
├── docker-compose.infra.yml
└── SETUP_GUIDE.md (this file)
```

---

## ✅ Next Steps

After setup:

1. **Customize Case Descriptions** - Update in seed.js
2. **Add More Skins** - Expand caseSkinsMap in seed.js
3. **Implement Trading** - Use TradesPage (already in UI)
4. **Steam Marketplace** - Connect to Steam for price tracking
5. **Analytics** - Track most opened cases, most valuable wins

---

## 📞 Support

Issues? Check the logs:
```bash
npm run dev 2>&1 | tee app.log
```

Then share the relevant error with your team.

---

**Happy casing!** 🎉
