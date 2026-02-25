# ResumeAI Modification TODO

## Phase 1: Database Updates
- [ ] Update User model - add isPremium field
- [ ] Update Resume model - add selectedTemplate field

## Phase 2: Backend API Updates
- [ ] Create new POST /api/ai/generate-resume endpoint
- [ ] Update AI service to return structured JSON

## Phase 3: Frontend - Create Resume Page
- [ ] Create /create-resume page with AI form
- [ ] Handle form submission, call API, redirect to preview

## Phase 4: Frontend - Resume Preview Page
- [ ] Create /resume-preview/[id] page
- [ ] Display 3 templates side by side
- [ ] Template selection functionality

## Phase 5: PDF Generation with Watermark
- [ ] Update PDF generation to check user premium status
- [ ] Add watermark for free users
- [ ] Create payment modal for free users

## Phase 6: Testing
- [ ] Test new flow end-to-end
- [ ] Test watermark logic
- [ ] Test payment modal
