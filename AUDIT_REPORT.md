# Backend-to-Frontend Feature Audit

## 1) Backend feature inventory

| Module | Endpoint / Route | DTO / Payload | Purpose | Guards / RBAC | Notes |
|---|---|---|---|---|---|
| Auth | `POST /auth/register` | `RegisterDto` | Register user by email/phone/password | Public | Creates user, may return session/user payload |
| Auth | `POST /auth/login` | `LoginDto` | Password or OTP login | Public | Supports email or phone |
| Auth | `POST /auth/send-otp` | `SendOtpDto` | Send OTP to phone | Public | SMS provider driven |
| Auth | `POST /auth/forgot-password` | `ForgotPasswordDto` | Start password reset flow | Public | Email/phone identifier |
| Auth | `POST /auth/reset-password` | `ResetPasswordDto` | Complete password reset | Public | Uses reset token |
| Auth | `POST /auth/logout` | none | Clear session | Public | Cookie/session cleanup |
| Auth | `GET /auth/google` / `GET /auth/google/callback` | OAuth | Google login | Public + Google guard | OAuth redirect flow |
| Auth | `GET /auth/github` / `GET /auth/github/callback` | OAuth | GitHub login | Public + GitHub guard | OAuth redirect flow |
| Auth | `GET /auth/linkedin` / `GET /auth/linkedin/callback` | OAuth | LinkedIn login | Public + LinkedIn guard | OAuth redirect flow |
| Auth | `GET /csrf-token` | none | CSRF token bootstrap | Public | Used by frontend `apiFetch` |
| Users | `GET /users/me` | none | Current user profile | JWT + Roles guard | Returns user with profile |
| Users | `PATCH /users/me/profile` | `UpdateProfileDto` | Update own profile | JWT + Roles guard | RBAC-aware self-service |
| Users | `GET /users` | none | List users | `OWNER`,`ADMIN` | Admin user management |
| Users | `POST /users` | `CreateUserDto` | Create user | `OWNER`,`ADMIN` | Includes profile bootstrap |
| Users | `GET /users/stats/roles` | none | Count users by role | `OWNER`,`ADMIN` | Role analytics |
| Users | `GET /users/:id` | none | User detail | `OWNER`,`ADMIN` | UUID route |
| Users | `PATCH /users/:id/profile` | `UpdateProfileDto` | Update user profile | `OWNER`,`ADMIN` | Admin edit |
| Users | `PATCH /users/:id/status` | `UpdateUserStatusDto` | Activate/deactivate user | `OWNER`,`ADMIN` | Admin edit |
| Users | `PATCH /users/:id/role` | `UpdateUserRoleDto` | Change role | `OWNER`,`ADMIN` | Admin edit |
| Users | `DELETE /users/:id` | none | Delete user | `OWNER` | Highest privilege only |
| Announcements | `GET /announcements` | `QueryAnnouncementDto` | Public/admin list | Public | Supports status/type/search |
| Announcements | `GET /announcements/:slug` | none | Public detail | Public | Slug route |
| Announcements | `POST /announcements` | `CreateAnnouncementDto` | Create announcement | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Logs activity |
| Announcements | `PATCH /announcements/:id` | `UpdateAnnouncementDto` | Update announcement | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Logs activity |
| Announcements | `DELETE /announcements/:id` | none | Delete announcement | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Logs activity |
| Articles | `GET /articles` | `QueryArticleDto` | Public/admin list | Public | Supports status/category/featured/search/tag |
| Articles | `GET /articles/:slug` | none | Public detail | Public | Slug route |
| Articles | `POST /articles` | `CreateArticleDto` | Create article | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Supports tags and featured |
| Articles | `PATCH /articles/:id` | `UpdateArticleDto` | Update article | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Logs activity |
| Articles | `DELETE /articles/:id` | none | Delete article | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Logs activity |
| Faculty | `GET /faculty` | `QueryFacultyDto` | Public/admin list | Public | Supports search/isActive |
| Faculty | `GET /faculty/:id` | none | Faculty detail | Public | UUID route |
| Faculty | `POST /faculty` | `CreateFacultyDto` | Create faculty member | `ADMIN`,`OWNER` | Admin content management |
| Faculty | `PATCH /faculty/:id` | `UpdateFacultyDto` | Update faculty member | `ADMIN`,`OWNER` | Admin content management |
| Faculty | `DELETE /faculty/:id` | none | Delete faculty member | `ADMIN`,`OWNER` | Admin content management |
| Gallery | `GET /gallery` | `QueryGalleryDto` | Public/admin list | Public | Supports search/category |
| Gallery | `GET /gallery/:id` | none | Gallery detail | Public | UUID route |
| Gallery | `POST /gallery` | `CreateGalleryDto` | Create gallery item | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Uses uploadedById |
| Gallery | `PATCH /gallery/:id` | `UpdateGalleryDto` | Update gallery item | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Admin content management |
| Gallery | `DELETE /gallery/:id` | none | Delete gallery item | `ADMIN`,`OWNER`,`CONTENT_EDITOR` | Admin content management |
| Feedback | `GET /feedback` | `QueryFeedbackDto` | Admin moderation list | `ADMIN`,`OWNER` | Search/approved filter |
| Feedback | `GET /feedback/approved` | none | Public approved list | Public | Used on home page |
| Feedback | `GET /feedback/:id` | none | Feedback detail | `ADMIN`,`OWNER` | Moderation detail |
| Feedback | `POST /feedback` | `CreateFeedbackDto` | Submit feedback | Public | CSRF skipped |
| Feedback | `PATCH /feedback/:id` | `UpdateFeedbackDto` | Approve/unapprove | `ADMIN`,`OWNER` | Moderation action |
| Feedback | `DELETE /feedback/:id` | none | Delete feedback | `ADMIN`,`OWNER` | Moderation action |
| Contact | `GET /contact` | `QueryContactDto` | Admin inbox | `ADMIN`,`OWNER` | Search/read filter |
| Contact | `GET /contact/:id` | none | Message detail | `ADMIN`,`OWNER` | Inbox detail |
| Contact | `POST /contact` | `CreateContactDto` | Public contact form | Public | CSRF skipped |
| Contact | `PATCH /contact/:id` | `UpdateContactDto` | Mark read/unread | `ADMIN`,`OWNER` | Read flag only |
| Contact | `DELETE /contact/:id` | none | Delete message | `ADMIN`,`OWNER` | Inbox cleanup |
| Activity log | `GET /activity-logs` | query params page/limit/action/targetType | Audit trail | `OWNER` | Paged response with meta |
| Analytics | `POST /analytics/track` | `TrackVisitDto` | Track page view | Public | CSRF skipped |
| Analytics | `GET /analytics/stats` | none | Dashboard analytics | `OWNER`,`ADMIN` | Total/today/month/top pages/daily views |
| Site settings | `GET /site-settings` | none | Public site config | Public | Used by frontend layout and contact section |
| Site settings | `PUT /site-settings/:key` | `UpsertSettingDto` | Update one setting | `ADMIN`,`OWNER` | Admin settings |
| Site settings | `PUT /site-settings` | `BulkUpsertDto` | Bulk update settings | `ADMIN`,`OWNER` | Admin settings |
| Newsletter | `POST /newsletter/subscribe` | `SubscribeDto` | Public subscription | Public | CSRF skipped |
| Newsletter | `POST /newsletter/unsubscribe` | `UnsubscribeDto` | Public unsubscribe | Public | Token-based |
| Newsletter | `GET /newsletter/subscribers` | `all` query string | Subscriber list | `ADMIN`,`OWNER` | `all=true` returns inactive too |
| Newsletter | `DELETE /newsletter/subscribers/:id` | none | Remove subscriber | `ADMIN`,`OWNER` | Admin management |
| Newsletter | `GET /newsletter/campaigns` | none | Campaign history | `ADMIN`,`OWNER` | Admin management |
| Newsletter | `POST /newsletter/campaigns/send` | `SendCampaignDto` | Send campaign | `ADMIN`,`OWNER` | Writes campaign history |

## 2) Frontend coverage analysis

| Backend feature | Frontend status | Existing routes | Existing components | Existing API calls | Missing pieces |
|---|---|---|---|---|---|
| Auth/register/login/OAuth/reset | Yes | `app/login`, `app/register`, `app/forgot-password`, `app/profile` | `components/auth/LoginClient`, `context/AuthContext` | `loginWithPassword`, `register`, `sendOtp`, `forgotPassword`, `resetPassword`, `getOAuthLoginUrl` | Add clearer error states and continue session UX (minor) |
| Profile self-service | Yes | `app/profile/page.tsx` | profile form UI | `getProfile`, `updateMyProfile`, `logout` | None critical |
| Public announcements/articles/gallery/faculty/feedback/contact | Yes | Home + public archive/detail pages | `components/sections/*` | `getAnnouncements`, `getArticles`, `getGalleryItems`, `getFacultyMembers`, `getFeedbacks`, `submitContact`, `submitFeedback` | None critical |
| Activity logs | Partial | `app/admin/logs/page.tsx` | logs table | `getActivityLogs` | Page already exists; needed stricter RBAC and cleaner filtering |
| Analytics | Partial | `app/admin/analytics/page.tsx`, dashboard | charts/cards | `adminGetAnalyticsStats`, `adminGetAnalytics` | Needed RBAC guard and dashboard role-awareness |
| Site settings | Partial | `app/admin/settings/page.tsx`, layout/contact section | settings form, contact section uses cached settings | `getSiteSettings`, `bulkUpdateSiteSettings`, `getCachedSiteSettings` | Needed better loading/error handling and privilege guard |
| Newsletter management | Partial | `app/admin/newsletter/page.tsx` | tables/editor | `adminGetSubscribers`, `adminGetCampaigns`, `adminSendCampaign`, `adminDeleteSubscriber` | Page had invalid top-level await and lacked RBAC guard |
| User/member management | Yes | `app/admin/members/page.tsx` | admin table/modal | `getUsers`, `createUser`, `updateUserProfile`, `updateUserRole`, `updateUserStatus`, `deleteUser` | Could still improve search/filter UX |
| Role management | No/Partial | `app/admin/roles/page.tsx` | placeholder | none | Replaced placeholder with role stats page and backend `/users/stats/roles` integration |
| Feedback moderation | Partial | `app/admin/feedback/page.tsx` | simple moderation list | `adminGetFeedback`, `adminUpdateFeedback`, `adminDeleteFeedback` | Needed stronger RBAC guard |
| Contact inbox | Partial | `app/admin/contacts/page.tsx` | message list/detail | `adminGetContacts`, `adminMarkContactRead`, `adminDeleteContact` | Needed stronger RBAC guard |
| Faculty management | Partial | `app/admin/faculty/page.tsx` | CRUD modal/list | `adminGetFaculty`, `adminCreateFaculty`, `adminUpdateFaculty`, `adminDeleteFaculty` | Needed stronger RBAC guard |
| Gallery management | Yes | `app/admin/gallery/page.tsx` | CRUD cards/modal | `adminGetGallery`, `adminCreateGallery`, `adminUpdateGallery`, `adminDeleteGallery` | None critical |
| Unsupported media/videos | No backend support | `app/admin/media/page.tsx`, `app/admin/videos/page.tsx` | placeholders | none | No backend endpoints exist; pages now state this explicitly instead of pretending to work |
| Dashboard overview | Partial | `app/admin/page.tsx` | cards/charts | mix of admin API calls | Needed role-aware fetching so content editors do not hit privileged endpoints |

## 3) Gap analysis

| Backend feature | Module / endpoint | Current frontend coverage | Missing UX / UI | Priority |
|---|---|---|---|---|
| Activity logs | `GET /activity-logs` | Existing page | Better filtering/empty states | High |
| Analytics | `GET /analytics/stats` | Dashboard + analytics page | Role-aware access and clearer visuals | High |
| Site settings | `GET/PUT /site-settings` | Admin settings page + contact/footer consumption | Better error handling, access guard, refresh action | High |
| Newsletter management | `GET/POST/DELETE /newsletter/*` | Page existed but was broken | RBAC, stable load flow, search/filter | High |
| User/role management | `GET/POST/PATCH /users/*` | Members page existed, roles page was placeholder | Role stats / clearer role panel | High |
| Feedback moderation | `GET/PATCH/DELETE /feedback/*` | Basic list | Access guard | Medium |
| Contact inbox | `GET/PATCH/DELETE /contact/*` | Basic inbox | Access guard | Medium |
| Faculty management | `GET/POST/PATCH/DELETE /faculty/*` | CRUD list | Access guard | Medium |
| Gallery management | `GET/POST/PATCH/DELETE /gallery/*` | CRUD list | Minor polish only | Medium |
| Unsupported media/videos | none | Placeholder routes only | Real backend module would be needed | Low |

## 4) Implemented changes

- **Role-aware admin dashboard**: dashboard no longer requests privileged analytics/contacts/feedback data for non-admin roles; it now shows a limited content dashboard for content editors.
- **Newsletter page fixed**: removed invalid top-level await, added RBAC guard, loading/error states, search, subscriber toggling, and safer deletion flow.
- **Role management page implemented**: replaced placeholder with a real page powered by `GET /users/stats/roles`.
- **Site settings page improved**: added loading/error feedback, refresh action, and RBAC guard.
- **Contacts/feedback/faculty pages protected**: direct-route access now blocks non-admin roles before fetching protected data.
- **Analytics page protected**: only ADMIN/OWNER can load analytics.
- **Unsupported media/video placeholders clarified**: pages now explain the backend limitation instead of implying functionality that does not exist.
- **Button component typing hardened**: `NeonButton` no longer depends on a fragile `React.*` namespace reference.
- **API types extended**: added newsletter and role-stat typings, and mapped `getPublications()` to the existing article source instead of a nonexistent route.

### Files created
- `AUDIT_REPORT.md`

### Files modified
- `types/index.ts`
- `lib/api.ts`
- `components/ui/NeonButton.tsx`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/analytics/page.tsx`
- `app/admin/newsletter/page.tsx`
- `app/admin/roles/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/contacts/page.tsx`
- `app/admin/feedback/page.tsx`
- `app/admin/faculty/page.tsx`
- `app/admin/media/page.tsx`
- `app/admin/videos/page.tsx`

### Deleted files
- None

## 5) Validation results

| Command | Result | Notes |
|---|---|---|
| `npx tsc --noEmit --pretty false` | Failed | Local environment is missing installed frontend dependencies (`react`, `next`, etc.), so TypeScript cannot resolve modules |
| `npm run build` (root) | Failed | `next: not found` because dependencies are not installed in the extracted workspace |
| `cd backend && npm run build` | Failed | `nest: not found` because backend dependencies are not installed |
| `npm run lint` | Not run | Same dependency blockage would prevent a meaningful run |
| `cd backend && npm run lint` | Not run | Same dependency blockage would prevent a meaningful run |

## 6) Remaining gaps

- The workspace does not have `node_modules` installed, so full type-check/build/lint validation could not complete locally.
- The backend does not yet expose dedicated media/video management endpoints, so those routes remain informational only.
- The main admin list pages now include search, pagination, and selected bulk actions. Remaining enhancements are limited to optional UX polish and the unsupported media/video placeholders.
