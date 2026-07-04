# ASCEND - Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ASCEND Application                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐  ┌──▼─────────┐  │
        │   Frontend   │  │  Backend   │  │
        │   (React)    │  │(Express)   │  │
        └──────────────┘  └────────────┘  │
                │             │           │
                │             │      ┌────▼────────┐
                │             │      │  MongoDB    │
                │             │      │  Database   │
                │             │      └─────────────┘
                │             │
                │        ┌────▼─────────┐
                │        │  OpenAI API  │
                │        │  (AI Coach)  │
                │        └──────────────┘
                │
        ┌───────▼────────┐
        │  REST API      │
        │  (HTTP/JSON)   │
        └────────────────┘
```

## Frontend Architecture (React/TypeScript)

### Directory Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── QuestsPage.tsx
│   │   ├── AchievementsPage.tsx
│   │   └── RewardsPage.tsx
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── CoachCard.tsx
│   │   └── [other components]
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx         # Global auth state
│   │
│   ├── services/
│   │   ├── api.ts                  # Axios instance
│   │   └── index.ts                # API service functions
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── index.css
│   │
│   ├── App.tsx                     # Main App component
│   └── main.tsx                    # Vite entry point
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── Dockerfile
```

### Component Hierarchy
```
App
├── AuthProvider
│   ├── BrowserRouter
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   └── ProtectedRoute
│   │       ├── Navbar
│   │       ├── DashboardPage
│   │       │   ├── Stats Cards
│   │       │   ├── XP Progress Bar
│   │       │   └── Recent Quests
│   │       ├── QuestsPage
│   │       │   ├── Filter Tabs
│   │       │   └── Quest Cards
│   │       ├── AchievementsPage
│   │       │   └── Achievement Grid
│   │       ├── RewardsPage
│   │       │   └── Reward Cards
│   │       └── [other pages]
```

## Backend Architecture (Express/Node.js)

### Directory Structure
```
backend/
├── src/
│   ├── models/
│   │   ├── User.ts          # User schema
│   │   ├── Quest.ts         # Quest schema
│   │   ├── Achievement.ts   # Achievement schema
│   │   └── Reward.ts        # Reward schema
│   │
│   ├── routes/
│   │   ├── auth.ts          # Auth endpoints
│   │   ├── users.ts         # User endpoints
│   │   ├── quests.ts        # Quest endpoints
│   │   ├── achievements.ts  # Achievement endpoints
│   │   ├── rewards.ts       # Reward endpoints
│   │   └── coach.ts         # AI Coach endpoints
│   │
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication
│   │
│   ├── services/
│   │   ├── userService.ts
│   │   ├── questService.ts
│   │   └── aiCoachService.ts
│   │
│   └── server.ts            # Express app setup
│
├── package.json
├── tsconfig.json
└── Dockerfile
```

### Request Flow
```
Request
  │
  ├─▶ Express Router
  │     │
  │     ├─▶ Auth Middleware (JWT verification)
  │     │     │
  │     │     └─▶ Route Handler
  │     │           │
  │     │           ├─▶ Validation
  │     │           │
  │     │           ├─▶ Business Logic
  │     │           │
  │     │           ├─▶ Database Query (MongoDB)
  │     │           │
  │     │           └─▶ Response
  │     │
  │     └─▶ Error Handling
  │
  └─▶ Client Response
```

## Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  level: Number,
  totalXP: Number,
  coins: Number,
  streak: Number,
  rank: String,
  joinedAt: Date,
  improvementAreas: [String],
  dailyProgress: Number
}
```

### Quests Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  difficulty: Enum,
  category: String,
  xpReward: Number,
  coinReward: Number,
  estimatedTime: Number,
  instructions: [String],
  tips: [String],
  completed: Boolean,
  completedAt: Date,
  createdAt: Date,
  skillsImproved: [{skill: String, increase: Number}],
  successCriteria: [String]
}
```

## Data Flow

### Authentication Flow
```
User Input (email, password)
    │
    ▼
Frontend: authService.login()
    │
    ▼
API: POST /api/auth/login
    │
    ▼
Backend: Find user in DB
    │
    ├─▶ User not found: Return 401
    │
    └─▶ Compare password
         │
         ├─▶ Password invalid: Return 401
         │
         └─▶ Password valid: Generate JWT
              │
              ▼
         Return token + user data
         │
         ▼
Frontend: Save token + user to localStorage
    │
    ▼
Update AuthContext state
    │
    ▼
Redirect to /dashboard
```

### Quest Completion Flow
```
User clicks "Complete Quest"
    │
    ▼
Frontend: questService.completeQuest(questId)
    │
    ▼
API: PATCH /api/quests/:questId/complete
    │
    ▼
Backend: Update quest (completed: true)
         │
         ▼
Frontend: userService.addProgress(xpReward, coinReward)
         │
         ▼
API: POST /api/users/add-progress
     │
     ▼
Backend: Update user stats
         ├─▶ totalXP += xpReward
         ├─▶ coins += coinReward
         ├─▶ Calculate new level
         └─▶ Check for achievements
         │
         ▼
Return updated user data
         │
         ▼
Frontend: Update AuthContext with new user data
         │
         ▼
Re-render UI with updated stats
```

## Technology Stack Details

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI** - AI integration
- **CORS** - Cross-origin requests

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Vite** - Frontend bundler
- **TypeScript Compiler** - Backend compilation

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing with bcryptjs
   - Protected routes

2. **Data Validation**
   - Server-side validation
   - Type checking with TypeScript

3. **CORS**
   - Restricted to frontend origin
   - Only necessary methods allowed

4. **Environment Variables**
   - Secrets not committed to Git
   - .env files in .gitignore

5. **Database**
   - Connection string uses environment variables
   - User data separated by user ID

## Performance Optimizations

1. **Frontend**
   - Code splitting with React lazy loading
   - Memoization for components
   - Virtual scrolling for large lists

2. **Backend**
   - Database indexing on frequently queried fields
   - Caching strategies
   - Efficient queries with select()

3. **Network**
   - Gzip compression
   - CDN for static assets
   - Request/response optimization

## Scalability Roadmap

1. **Horizontal Scaling**
   - Load balancer for multiple backend instances
   - Database replication

2. **Caching Layer**
   - Redis for session management
   - In-memory caching for frequently accessed data

3. **Microservices**
   - Separate auth service
   - Quest generation service
   - Analytics service

4. **Message Queue**
   - Background job processing
   - Notification system
   - Email service

---

For more details, see:
- [Setup Guide](./SETUP.md)
- [API Documentation](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)
