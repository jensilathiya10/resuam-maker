# AI Resume Maker SaaS - Technical Specification

## 1. Project Overview

**Project Name:** ResumeAI Pro
**Type:** Full-stack SaaS Web Application
**Core Functionality:** AI-powered resume builder with real-time preview, PDF export, and ATS optimization
**Target Users:** Job seekers, professionals, career changers

---

## 2. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **PDF Generation:** @react-pdf/renderer

### Backend
- **Runtime:** Node.js
- **Framework:** Express + TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (access + refresh tokens)
- **Password Hashing:** bcrypt
- **AI Integration:** OpenAI GPT-4 API

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** `#4F46E5` (Indigo-600)
- **Primary Dark:** `#6366F1` (Indigo-500)
- **Secondary:** `#10B981` (Emerald-500)
- **Background Light:** `#F9FAFB` (Gray-50)
- **Background Dark:** `#0F172A` (Slate-900)
- **Surface Light:** `#FFFFFF`
- **Surface Dark:** `#1E293B` (Slate-800)
- **Text Primary Light:** `#111827` (Gray-900)
- **Text Primary Dark:** `#F9FAFB` (Gray-50)
- **Text Secondary:** `#6B7280` (Gray-500)
- **Border Light:** `#E5E7EB` (Gray-200)
- **Border Dark:** `#374151` (Gray-700)
- **Accent Gradient:** `linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)`

### Typography
- **Font Family:** Inter (via Google Fonts)
- **Headings:**
  - H1: 48px / 700 weight
  - H2: 36px / 600 weight
  - H3: 24px / 600 weight
- **Body:** 16px / 400 weight
- **Small:** 14px / 400 weight
- **Caption:** 12px / 500 weight

### Spacing System
- **Base unit:** 4px
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px
- **Container max-width:** 1280px
- **Section padding:** 96px vertical, 24px horizontal

### Border Radius
- **Small:** 8px (buttons, inputs)
- **Medium:** 12px (cards)
- **Large:** 16px (modals)
- **XL:** 24px (cards, containers)

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

---

## 4. Page Specifications

### 4.1 Landing Page (/)

**Hero Section:**
- Full viewport height
- Animated gradient background with subtle floating shapes
- Headline: "Build Your Professional Resume in Minutes"
- Subheadline: "AI-powered resume builder that helps you create ATS-optimized resumes that land interviews"
- CTA Button: "Create Resume Free" (primary gradient button)
- Secondary CTA: "View Templates" (outline button)
- Hero illustration or animated 3D resume mockup

**Features Section (4 cards):**
1. AI-Powered Writing - "Let AI help you craft compelling content"
2. Real-time Preview - "See your resume update as you type"
3. ATS Optimization - "Resumes optimized for applicant tracking systems"
4. Multiple Templates - "Professional templates for every industry"

**Template Preview Section:**
- Horizontal scroll or grid of 3 template cards
- Each card: thumbnail, name, "Use Template" button

**Pricing Section:**
- Free tier: Basic features, 1 resume
- Pro tier ($9.99/mo): Unlimited resumes, AI generation, PDF download

**Footer:**
- Logo, navigation links, social icons, copyright

### 4.2 Authentication Pages (/login, /register)

**Layout:**
- Split screen: Form on left, illustration/background on right
- Centered card for mobile

**Login Form:**
- Email input
- Password input
- "Remember me" checkbox
- "Forgot password?" link
- Submit button
- "Don't have an account? Sign up" link

**Register Form:**
- Full name input
- Email input
- Password input
- Confirm password input
- Terms checkbox
- Submit button
- "Already have an account? Sign in" link

**Validation:**
- Email format validation
- Password min 8 characters
- Passwords must match (register)

### 4.3 Dashboard (/dashboard)

**Layout:**
- Top navigation with user menu
- Main content area with resume grid

**Components:**
- Welcome message with user name
- "Create New Resume" prominent button
- Resume cards grid (3 columns desktop)
- Each card: title, template type, created date, edit/delete actions

### 4.4 Templates Page (/templates)

**Layout:**
- Page header with title
- Grid of 3 template cards

**Templates:**
1. **Modern Pro** - Corporate/Professional
   - Clean layout, left sidebar for contact
   - Traditional structure
   
2. **Minimal Elegant** - Modern/Minimalist
   - Plenty white space
   - Sans-serif typography
   - Timeline-based experience

3. **Creative Designer** - Creative/Design
   - Bold accent colors
   - Modern layout
   - Portfolio-focused

**Template Card:**
- Preview thumbnail
- Template name
- Description
- "Use Template" button

### 4.5 Resume Editor (/editor)

**Layout:**
- Full screen split view
- Left panel (40%): Form sections
- Right panel (60%): Live preview
- Sticky header with actions

**Form Sections (Accordion/Collapsible):**
1. Personal Information
   - Full Name
   - Email
   - Phone
   - Location (City, Country)
   - LinkedIn URL
   - Portfolio URL
   
2. Professional Summary
   - Textarea
   - AI Generate button
   
3. Work Experience (Dynamic)
   - Job Title
   - Company Name
   - Location
   - Start Date
   - End Date (or "Present")
   - Description (bullet points)
   - AI Generate bullets button
   - Add/Remove buttons
   
4. Education (Dynamic)
   - Degree
   - Institution
   - Location
   - Start Date
   - End Date
   - GPA (optional)
   
5. Projects (Dynamic)
   - Project Name
   - Description
   - Technologies Used
   - Link
   
6. Skills
   - Tag input for skills
   - Categorize: Technical, Soft Skills
   
7. Certifications (Dynamic)
   - Certification Name
   - Issuer
   - Date

**Preview Panel:**
- A4 aspect ratio container
- Real-time updates
- Template-specific styling
- Zoom controls

**Header Actions:**
- Save Draft (auto-save indicator)
- Download PDF
- Preview mode toggle
- Close/Back button

---

## 5. API Specification

### Authentication Endpoints

**POST /api/auth/register**
```
Request: { name, email, password }
Response: { user, accessToken, refreshToken }
```

**POST /api/auth/login**
```
Request: { email, password }
Response: { user, accessToken, refreshToken }
```

**POST /api/auth/refresh**
```
Request: { refreshToken }
Response: { accessToken, refreshToken }
```

**POST /api/auth/logout**
```
Request: { refreshToken }
Response: { message }
```

### Resume Endpoints

**GET /api/resumes**
```
Headers: Authorization: Bearer <token>
Response: { resumes[] }
```

**POST /api/resumes**
```
Headers: Authorization: Bearer <token>
Request: { title, templateType, resumeData }
Response: { resume }
```

**GET /api/resumes/:id**
```
Headers: Authorization: Bearer <token>
Response: { resume }
```

**PUT /api/resumes/:id**
```
Headers: Authorization: Bearer <token>
Request: { title?, templateType?, resumeData? }
Response: { resume }
```

**DELETE /api/resumes/:id**
```
Headers: Authorization: Bearer <token>
Response: { message }
```

### AI Generation Endpoint

**POST /api/ai/generate**
```
Headers: Authorization: Bearer <token>
Request: { 
  type: 'summary' | 'experience',
  jobRole: string,
  experienceLevel: string,
  skills: string[],
  workHistoryNotes: string
}
Response: { generatedContent: string }
```

---

## 6. Database Schema

### User Collection
```
typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Collection
```
typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: string,
  templateType: 'modern' | 'minimal' | 'creative',
  resumeData: {
    personalInfo: {
      fullName: string,
      email: string,
      phone: string,
      location: string,
      linkedin: string,
      portfolio: string
    },
    summary: string,
    experience: [{
      jobTitle: string,
      company: string,
      location: string,
      startDate: string,
      endDate: string,
      description: string[]
    }],
    education: [{
      degree: string,
      institution: string,
      location: string,
      startDate: string,
      endDate: string,
      gpa: string
    }],
    projects: [{
      name: string,
      description: string,
      technologies: string[],
      link: string
    }],
    skills: {
      technical: string[],
      soft: string[]
    },
    certifications: [{
      name: string,
      issuer: string,
      date: string
    }]
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. State Management (Zustand)

### Auth Store
```
typescript
{
  user: User | null,
  isAuthenticated: boolean,
  accessToken: string | null,
  login: (credentials) => Promise,
  register: (userData) => Promise,
  logout: () => void,
  refreshToken: () => Promise
}
```

### Resume Store
```
typescript
{
  currentResume: Resume | null,
  resumes: Resume[],
  selectedTemplate: TemplateType,
  setCurrentResume: (resume) => void,
  updateResumeData: (data) => void,
  fetchResumes: () => Promise,
  saveResume: (resume) => Promise,
  deleteResume: (id) => Promise
}
```

### UI Store
```
typescript
{
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  sidebarOpen: boolean,
  toggleSidebar: () => void
}
```

---

## 8. Security Requirements

- All passwords hashed with bcrypt (12 rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 days expiry)
- Protected API routes middleware
- Input validation with Zod
- CORS configuration
- Environment variables for secrets
- Rate limiting on auth endpoints

---

## 9. Animation Specifications

### Page Transitions
- Fade in with slight upward slide
- Duration: 300ms
- Easing: ease-out

### Component Animations
- Card hover: translateY(-4px), shadow increase
- Button hover: scale(1.02), brightness increase
- Input focus: border color transition
- Modal: scale from 0.95 to 1, fade in

### Landing Page
- Hero text: staggered fade-in from bottom
- Feature cards: fade-in on scroll
- Template cards: slide-in on scroll

### Micro-interactions
- Loading spinners
- Success/error toast animations
- Form validation feedback
- Button press feedback

---

## 10. Project Structure

```
resume-maker/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── templates/
│   │   │   │   └── editor/
│   │   │   ├── api/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── forms/        # Form components
│   │   │   ├── resume/       # Resume-specific components
│   │   │   └── layouts/      # Layout components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   │   ├── api.ts
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── stores/           # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── public/
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── backend/                  # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── index.ts
│   ├── .env
│   └── package.json
│
├── SPEC.md
└── README.md
```

---

## 11. Acceptance Criteria

### Authentication
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT tokens
- [ ] Protected routes redirect to login
- [ ] Tokens refresh automatically

### Dashboard
- [ ] Users see their saved resumes
- [ ] Can create new resume
- [ ] Can edit existing resume
- [ ] Can delete resume

### Templates
- [ ] All 3 templates display correctly
- [ ] Template selection works
- [ ] Templates apply to preview

### Editor
- [ ] All form sections are editable
- [ ] Dynamic add/remove for arrays
- [ ] Real-time preview updates
- [ ] Auto-save works
- [ ] PDF download works

### AI Generation
- [ ] Summary generation works
- [ ] Experience bullet generation works
- [ ] Content is ATS-optimized

### UI/UX
- [ ] Dark/light mode toggle works
- [ ] Responsive on all breakpoints
- [ ] Animations are smooth
- [ ] Page transitions work

### PDF Export
- [ ] Generates A4 format
- [ ] ATS-friendly formatting
- [ ] Downloads correctly

---

## 12. Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-maker
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
