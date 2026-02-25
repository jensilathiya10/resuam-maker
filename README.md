# AI Resume Maker SaaS - Full Stack Application

A modern, AI-powered resume builder that helps job seekers create professional, ATS-optimized resumes in minutes.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-turbo)

## 🚀 Features

### Core Features
- **AI-Powered Resume Generation**: Generate professional resumes using OpenAI GPT-4
- **Real-time Preview**: See your resume update as you type
- **Multiple Templates**: Choose from 3 professional templates (Modern, Minimal, Creative)
- **PDF Export**: Download your resume in ATS-friendly PDF format
- **JWT Authentication**: Secure user authentication with access + refresh tokens

### Editor Features
- Split-screen editor with live preview
- Dynamic form sections (add/remove experiences, education, projects, certifications)
- Collapsible sections for better organization
- Skills management with tag input
- Auto-save functionality

### Additional Features
- Dark/Light mode toggle
- Responsive design (mobile, tablet, desktop)
- Smooth Framer Motion animations
- Form validation with Zod

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **PDF**: @react-pdf/renderer
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens)
- **Password Hashing**: bcrypt
- **AI**: OpenAI GPT-4 API

## 🏗️ Project Structure

```
resume-maker/
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (AI)
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # App entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/               # Next.js 14 frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   │   ├── (auth)/   # Auth pages
│   │   │   ├── dashboard/
│   │   │   ├── templates/
│   │   │   ├── editor/
│   │   │   └── api/
│   │   ├── components/   # React components
│   │   │   ├── ui/       # Reusable UI
│   │   │   ├── layouts/  # Layout components
│   │   │   └── resume/   # Resume components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities & API
│   │   ├── stores/       # Zustand stores
│   │   └── types/        # TypeScript types
│   ├── .env.example
│   └── package.json
│
├── SPEC.md               # Technical specification
└── README.md            # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- OpenAI API Key (optional for testing)

### Installation

1. **Clone the repository**
   
```
bash
   cd resume-maker
   
```

2. **Set up the backend**
   
```
bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   
```
   
   Backend runs on http://localhost:5000

3. **Set up the frontend**
   
```
bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local if needed
   npm run dev
   
```
   
   Frontend runs on http://localhost:3000

### Environment Variables

#### Backend (.env)
```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-maker
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```
env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | Get all user resumes |
| POST | `/api/resumes` | Create new resume |
| GET | `/api/resumes/:id` | Get resume by ID |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |

### AI Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate content (summary/experience) |
| POST | `/api/ai/generate-resume` | Generate full resume |

## 🎨 Templates

### 1. Modern Pro
- Clean, corporate design
- Left-aligned header with primary color accents
- Traditional section layout
- Ideal for: Corporate jobs, traditional industries

### 2. Minimal Elegant
- Plenty of white space
- Sans-serif typography
- Timeline-based experience
- Ideal for: Modern tech, startups, creative roles

### 3. Creative Designer
- Bold accent colors (gradient header)
- Portfolio-focused layout
- Skill badges
- Ideal for: Design, marketing, creative industries

## 🔐 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 days expiry)
- Protected API routes with middleware
- Input validation with Zod
- CORS configuration
- Environment variable protection

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js, Express, MongoDB, and OpenAI
