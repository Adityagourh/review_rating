# Review & Rating API — Documentation

Base URL: same origin the server is reached on (local default `http://localhost:9000`)
No global path prefix — routes are mounted directly at `/user`, `/company`, `/comment`.

All JSON responses share a common `success: boolean` envelope. File-uploabcng endpoints expect `multipart/form-data`; everything else expects `application/json`.

---

## Role-based access control

**There is no active role-based access control in this project.**

- `models/userSchema.js` has a `userRole` field that defaults to `"user"` on every signup.
- `middlewares/authontication.js` defines an `authorizeAdmin` middleware that checks `req.user.role === "users"`, but it is **not wired into any route** — it's only referenced as a commented-out import in `routes/companyRoute.js` (`//let {authorizeAdmin}= require('../middlewares/authontication')`) and is dead code.
- Test files (`test/user.test.js`, `test/companyReviewTestCase.js`) reference an `"admin"` role in comments only — never asserted against real middleware.

**What access control actually exists** is authentication-only (logged-in vs. not), via `middlewares/authToken.js` (`tokenVerification`):

| Check | Behavior |
|---|---|
| No/invalid `Authorization` header | `409` `{ success: false, message: "token is invalid" }` |
| Expired/invalid JWT | `401` `{ success: false, message: "Token Expire please Login aganin" }` |
| Valid JWT | attaches decoded `req.user`, calls `next()` — **no role check of any kind** |

`tokenVerification` is applied to exactly **one** route: `POST /company/create`. Every other route (including creating/updating/deleting reviews) has **no auth middleware at all** — anyone can call them, logged in or not.

Expected `Authorization` header format: `Authorization: Bearer <token>`

> ⚠️ If you need real RBAC (e.g. only admins can add companies, only a review's author can edit/delete it), that logic doesn't exist yet and would need to be built — the `userRole` field and `authorizeAdmin` middleware are just unused scaffolding.

---

## Auth model

- `POST /user/login` returns a JWT signed with `process.env.SECRET_KEY`, **expires in 2 minutes** (`expiresIn: "2m"`) — very short-lived, by design of the current code.
- The JWT payload is `{ userData }` — the *entire* Mongo user document (including the bcrypt-hashed password) is embedded in the token claims.
- Send it back as `Authorization: Bearer <token>` on protected calls.

---

## Table of contents

- [User](#user)
  - [POST /user/create](#post-usercreate)
  - [POST /user/login](#post-userlogin)
  - [POST /user/sendlink](#post-usersendlink)
  - [GET /user/resetpassword/:id/:token](#get-userresetpasswordidtoken)
- [Company](#company)
  - [POST /company/create](#post-companycreate--auth-required)
  - [GET /company/list](#get-companylist)
  - [GET /company/review/:id](#get-companyreviewid)
  - [POST /company/findcompanies](#post-companyfindcompanies)
  - [GET /company/searchcompany/:letters](#get-companysearchcompanyletters)
- [Review (comment)](#review-comment)
  - [POST /comment/create](#post-commentcreate)
  - [GET /comment/list](#get-commentlist)
  - [PATCH /comment/update/:id](#patch-commentupdateid)
  - [DELETE /comment/delete/:id](#delete-commentdeleteid)

---

## User

### POST /user/create

Register a new user. **Multipart/form-data** — `profilePic` file field is optional (if omitted, the user is created without a `profilePic`).

**Auth required:** No

**Body (`multipart/form-data`):**

| Field | Type | Rules |
|---|---|---|
| `userName` | text | required, 3–30 chars |
| `userEmail` | text | required, valid email |
| `userPassword` | text | required — ≥1 uppercase, ≥1 lowercase, ≥1 number, ≥1 special char, no whitespace, Latin chars only |
| `userPhone` | text/number | required, 9–10 digits (100000000–9999999999) |
| `userCity` | text | required |
| `userState` | text | required |
| `profilePic` | file (image) | optional |

**Success — `201`:**
```json
{
  "success": true,
  "message": "User added sucessfully",
  "user": {
    "_id": "665f1b2c...",
    "userName": "Jordan Lee",
    "userEmail": "jordan@example.com",
    "userPassword": "$2b$10$...(bcrypt hash)...",
    "userPhone": 9876543210,
    "userCity": "Austin",
    "userState": "Texas",
    "userRole": "user",
    "profilePic": "/uploads/user/image_1717000000000.jpg",
    "isActive": true,
    "createdAt": "2026-09-05T10:00:00.000Z",
    "updatedAt": "2026-09-05T10:00:00.000Z"
  }
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `401` | `{ "success": false, "message": "User is already registered with this email" }` | Duplicate `userEmail` |
| `400` | Joi validation error object | Missing/invalid field (from `registerUserValidation`) |
| `500` | `{ "success": false, "message": "Error occur ..." }` | Unexpected error |

---

### POST /user/login

**Auth required:** No

**Body (`application/json`):**
```json
{
  "userEmail": "jordan@example.com",
  "userPassword": "Str0ng!Pass"
}
```

**Success — `200`:**
```json
{
  "success": true,
  "message": "Login successfully",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
Token expires in **2 minutes**. Decode it to get the full user object under the `userData` claim.

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `401` | `{ "success": false, "message": "Invalid user email or password" }` | Wrong password |
| `403` | `{ "success": false, "message": "User is not register with this email" }` | No such email |
| `500` | `{ "success": false, "error": "Error occur ..." }` | Unexpected error |

---

### POST /user/sendlink

Requests a password-reset "link" (email sending is currently **disabled and hardcoded locally** — see note below).

**Auth required:** No

**Body (`application/json`):**
```json
{
  "userEmail": "jordan@example.com"
}
```

**Success — `201`:**
```json
{
  "success": true,
  "message": "OTP generated successfully (email sending disabled locally)",
  "otp": "435568",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userID": "665f1b2c..."
}
```

> Note: the real `nodemailer` send is commented out in `controller/userController.js` (kept, not deleted) and replaced with a hardcoded OTP `435568` for local testing. The `token`/`userID` returned here are what's needed to call the reset-password endpoint below — no email round-trip is required locally.

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `403` | `{ "success": false, "message": "Please enter valid email" }` | No user with that email |
| `500` | `{ "success": false, "message": "Error occur ..." }` | Unexpected error |

---

### GET /user/resetpassword/:id/:token

Resets a user's password using the `id`/`token` pair from `sendResetLink`. Unusually, this is a **`GET`** request that reads its payload from the **request body** (not query params).

**Auth required:** No (the `:token` in the URL acts as the credential, scoped to that user id + `SECRET_KEY`, 20 min expiry)

**URL params:** `id` = user's Mongo `_id`, `token` = JWT from `/user/sendlink`

**Body (`application/json`, sent with a GET request):**
```json
{
  "newPassword": "NewStr0ng!Pass",
  "confirmPassword": "NewStr0ng!Pass"
}
```

**Success — `200`:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `401` | `{ "success": false, "message": "New password and confirm password is not same" }` | Mismatch |
| `403` | `{ "success": false, "message": "User id is not found" }` | Bad `id` |
| `500` | `{ "success": false, "message": "Error occur ..." }` | Bad/expired token, or other error |

---

## Company

### POST /company/create — 🔒 auth required

Creates a company. **Multipart/form-data** — `profilePic` file field is **required** (the controller will throw if it's missing, surfacing as a `500`).

**Auth required:** Yes — `Authorization: Bearer <token>` (any logged-in user; no role restriction)

**Body (`multipart/form-data`):**

| Field | Type | Rules |
|---|---|---|
| `companyName` | text | required, 3–30 chars |
| `companyLocation` | text | required, 3–30 chars |
| `companyCity` | text | required, 3–30 chars |
| `profilePic` | file (image) | **required** |

**Success — `201`:**
```json
{
  "success": true,
  "message": "Company added successfully",
  "company": {
    "_id": "665f1c00...",
    "companyName": "Acme Corp",
    "companyLocation": "Downtown",
    "companyCity": "Austin",
    "profilePic": "/uploads/company/image_1717000000000.jpg",
    "isActive": true,
    "createdAt": "2026-09-05T10:05:00.000Z",
    "updatedAt": "2026-09-05T10:05:00.000Z"
  }
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `409` | `{ "success": false, "message": "token is invalid" }` | Missing/malformed `Authorization` header |
| `401` | `{ "success": false, "message": "Token Expire please Login aganin" }` | Expired/invalid JWT |
| `401` | `{ "success": false, "message": "Company is already exist" }` | Duplicate `companyName` |
| `500` | `{ "success": false, "error": "Error occur ..." }` | Missing `profilePic`, or other error |

---

### GET /company/list

**Auth required:** No

**Success — `200`:**
```json
{
  "success": true,
  "totalCompanies": 12,
  "companys": [
    {
      "_id": "665f1c00...",
      "companyName": "Acme Corp",
      "companyLocation": "Downtown",
      "companyCity": "Austin",
      "profilePic": "/uploads/company/image_1717000000000.jpg",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### GET /company/review/:id

Returns a company's profile plus all of its reviews.

**Auth required:** No

**URL params:** `id` = company's Mongo `_id`

**Success — `200`:**
```json
{
  "success": true,
  "message": "Review list fetched successfully",
  "company": {
    "_id": "665f1c00...",
    "companyName": "Acme Corp",
    "companyLocation": "Downtown",
    "companyCity": "Austin",
    "profilePic": "/uploads/company/image_1717000000000.jpg"
  },
  "review": [
    {
      "_id": "665f1d11...",
      "subject": "Great to work with",
      "review": "Responsive and professional.",
      "rating": "5",
      "companyId": "665f1c00...",
      "userId": {
        "_id": "665f1b2c...",
        "userName": "Jordan Lee"
      },
      "createdAt": "..."
    }
  ]
}
```

> Note: the populate call selects `"userName profilPic"` — that's a typo in the backend for `profilePic`, so the reviewer's photo is never actually populated here, only `userName`.

If `id` doesn't match any company, `company` is `null` and `review` is `[]` (still a `200`, not a `404`).

---

### POST /company/findcompanies

Prefix search by company name, via request body.

**Auth required:** No

**Body (`application/json`):**
```json
{
  "companyByLetter": "Ac"
}
```
Matches companies whose `companyName` **starts with** this string (case-insensitive regex `^<value>`, so it's a prefix match, not substring).

**Success — `200`:**
```json
{
  "success": true,
  "message": "Company found successfully",
  "companies": [ { "_id": "...", "companyName": "Acme Corp", "...": "..." } ]
}
```

**No matches — `400`:**
```json
{ "success": false, "message": "Companys are not exists " }
```

---

### GET /company/searchcompany/:letters

Same prefix search as above, via URL param instead of body.

**Auth required:** No

**URL params:** `letters` — e.g. `/company/searchcompany/Ac`

**Success / errors:** identical shape to `POST /company/findcompanies`.

---

## Review (comment)

Mounted under `/comment` (the code/files call this "review" internally, but the route prefix is `comment`).

### POST /comment/create

**Auth required:** No (no middleware attached to this route, despite the model requiring `userId`/`companyId`)

**Body (`application/json`):**
```json
{
  "subject": "Great to work with",
  "review": "Responsive and professional throughout.",
  "rating": "5",
  "userId": "665f1b2c...",
  "companyId": "665f1c00..."
}
```
Notes:
- `rating` must be sent as a **string**, not a number (schema field type is `String`).
- `userId` / `companyId` must be valid Mongo ObjectIds of existing documents (not validated against `userSchema`/`companySchema` — an arbitrary-but-valid-looking ObjectId will still save).

**Success — `201`:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "user": {
    "_id": "665f1d11...",
    "subject": "Great to work with",
    "review": "Responsive and professional throughout.",
    "rating": "5",
    "userId": "665f1b2c...",
    "companyId": "665f1c00...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```
(Field is called `user` in the response even though it's the created review — pre-existing naming in the controller.)

**Errors:**
| Status | Body |
|---|---|
| `500` | `{ "success": false, "message": "Error occur ..." }` |

---

### GET /comment/list

**Auth required:** No

**Success — `200`:**
```json
{
  "success": true,
  "message": "Record's get successfully!",
  "comment": [
    { "_id": "665f1d11...", "subject": "...", "review": "...", "rating": "5", "userId": "...", "companyId": "..." }
  ]
}
```
Not populated — `userId`/`companyId` are raw ObjectId strings here (unlike `/company/review/:id`, which populates `userId`).

---

### PATCH /comment/update/:id

**Auth required:** No (anyone can update anyone's review — no ownership check)

**URL params:** `id` = review's Mongo `_id`

**Body (`application/json`)** — any subset of updatable fields:
```json
{
  "subject": "Updated subject",
  "review": "Updated review text",
  "rating": "4"
}
```

**Success — `201`:**
```json
{
  "success": true,
  "message": "Review records update successfully",
  "updateReview": { "_id": "665f1d11...", "subject": "Updated subject", "...": "..." }
}
```
(`updateReview` is `null` if `id` doesn't match any document — still `201`, not `404`.)

---

### DELETE /comment/delete/:id

**Auth required:** No (anyone can delete anyone's review — no ownership check)

**URL params:** `id` = review's Mongo `_id`

**Success — `202`:**
```json
{
  "success": true,
  "message": "Comment records delete successfully",
  "deletedReview": { "_id": "665f1d11...", "subject": "...", "...": "..." }
}
```
(`deletedReview` is `null` if `id` didn't match anything — still `202`.)

---

## Known gaps (as of this document)

- No role-based access control (see [top of doc](#role-based-access-control)).
- No ownership checks on review update/delete — any client can edit/delete any review by id.
- `/comment/create`, `/comment/update/:id`, `/comment/delete/:id` have no auth middleware at all.
- `reviewValidation` (Joi schema for subject/review/rating) is imported in `routes/reviewRoutes.js` but never actually applied to the route — bad input mostly surfaces as a Mongoose validation `500`, not a clean `400`.
- Real email sending is disabled; `/user/sendlink` and the demo `/send` route return a hardcoded OTP (`435568`) instead.
