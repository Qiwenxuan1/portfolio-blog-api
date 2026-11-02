# Lab Manual - 19

Add security headers and limit repeated requests

This is the complete project at the end of this lab. Open this folder as the project root. Each later lab adds to the same Portfolio and Blog API.

## Open the project

- VS Code: choose File > Open Folder, select this folder, then Terminal > New Terminal.
- IntelliJ IDEA: choose File > Open, select this folder, then View > Tool Windows > Terminal.
- Use Node.js 24 LTS and its npm. Run commands in the folder containing package.json.

## Run locally

Install the versions recorded in the lockfile:

```powershell
npm.cmd ci
# macOS/Linux: npm ci
```

Before starting, use your editor to copy .env.example to a new file named .env in this folder. Fill in your own settings:

- MONGO_URI: use your Atlas database user and password, cluster address, and the portfolio_blog database name.
- PORT: keep 3000 for local requests.
- In Atlas, allow your current public IP address and give the application user readWrite access to portfolio_blog.
- JWT_SECRET: replace the example with a new random secret of at least 64 letters and digits. Keep it private.
- CLIENT_ORIGIN: use the exact local front-end origin, such as http://localhost:5173, without a trailing slash.
- TRUST_PROXY: keep 0 for a direct local connection. Use 1 for the single-proxy Render setup described in Lab 20.

Atlas data belongs to your database account. A fresh database has no earlier posts or accounts; add the sample data through Atlas or the API as described in the lab.

Start the development server:

```powershell
npm.cmd run dev
# macOS/Linux: npm run dev
```

Open http://localhost:3000. Leave the terminal open while sending requests. Press Ctrl+C to stop.

To run without automatic restarts:

```powershell
npm.cmd start
# macOS/Linux: npm start
```

## Send requests

Use Postman. For a JSON body, choose Body > raw > JSON. Choose the method, enter the full URL, and click Send.

- GET /api/blog returns saved posts.
- GET /api/blog/PASTE_POST_ID_HERE returns one saved post.
- POST /api/blog accepts title and content. Copy the returned _id for later requests.
- PUT /api/blog/PASTE_POST_ID_HERE requires both title and content.
- DELETE /api/blog/PASTE_POST_ID_HERE removes the selected post and returns 204 with no body.
- The same post routes also work under /api/posts.
- Blog create, update, and delete require a Bearer token. Public reads do not.
- Update and delete must use the saved post author’s token. Admin status does not override post ownership.

Example post body:

```json
{
  "title": "My course post",
  "content": "This post is part of the course API."
}
```

## Portfolio and contact requests

- GET /api/projects lists portfolio projects.
- POST /api/projects accepts title, description, and optional imageUrl, repoUrl, and liveUrl fields.
- POST /api/contact accepts name, email, and message; the response is a receipt.
- GET, PUT, and DELETE /api/projects/PASTE_PROJECT_ID_HERE handle one project.
- A project update requires title and description. Optional links can be supplied too.
- Only admins can create, update, or delete projects.
- GET /api/contact is admin-only. Contact submission stays public.

## Sample accounts

POST /api/users/register with a new username, email, and password:

```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "CoursePass123!"
}
```

Create Bob and Carol by changing the username and email. These are sample credentials for class; registration always creates an author account. Existing accounts in your database do not need to be registered again.

POST /api/users/login with email and password to receive a one-hour token. For protected requests in Postman, choose Authorization > Bearer Token and paste only the token value. Keep tokens out of shared screenshots and source.

GET /api/users/me with a Bearer token returns the verified account. Missing, invalid, or expired tokens return 401. The code finishes with the normal one-hour token expiry.

## Prepare the portfolio admin

Using your trusted Atlas account, find Alice in portfolio_blog > users and change only her role field from author to admin. Keep Bob and Carol as authors. Do not change the password hash or add a public promotion route.

## Earlier sample records

For old posts without an author and projects without a user, assign the trusted sample owner’s real User _id in Atlas. Store author/user as BSON ObjectId. If a valid owner is still stored as String, change its type to ObjectId while keeping that same ID. Do not overwrite another author’s valid ownership.

Public post/project reads populate only the related user’s _id and username. Emails and password hashes stay private.

## Comments

- GET /api/blog/PASTE_POST_ID_HERE/comments lists comments for an existing post.
- POST to the same URL with a body field and a Bearer token creates a comment.
- GET /api/blog/PASTE_POST_ID_HERE includes its comments.
- DELETE /api/blog/PASTE_POST_ID_HERE/comments/PASTE_COMMENT_ID_HERE requires the comment author or post author.
- A post with comments returns 409 on deletion. Remove its comments first.

## Security settings

Helmet sets secure headers. JSON bodies are limited to 32 KB. Login and registration share 10 requests per IP per 15 minutes; contact allows 5. The limits use memory and reset on restart. CORS uses CLIENT_ORIGIN.

## Continue the course

Keep this completed lab folder as a reference. To continue the guided exercise, work in your own portfolio-blog-api folder and follow the next manual’s file changes. Keep package.json and package-lock.json together. Do not copy .env or node_modules into a submission.
