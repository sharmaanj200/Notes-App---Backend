# Backend Notes APIs Assignment
A secure authentication mechanism using JWT token and a double-submit cookie pattern, and scalable notes apis built with NodeJS, ExpressJS, and MongoDB.

# Implemented
- **Technical Requirements**
    - ✅ Implement a RESTful API using a framework of your choice (e.g. Express, DRF, Spring).
    - ✅ Use a database of your choice to store the data (preferably MongoDB or PostgreSQL).
    - ✅ Use any authentication protocol and implement a simple rate limiting and request throttling to handle high traffic.
    - ✅ Implement search functionality to enable users to search for notes based on keywords. ( preferably text indexing for high performance )
    - ✅ Write unit tests and integration tests your API endpoints using a testing framework of your choice.
- **API Endpoints**: Your API should implement the following endpoints:
    Authentication Endpoints
    - ✅ POST /api/auth/signup: create a new user account.
    - ✅ POST /api/auth/login: log in to an existing user account and receive an access token.
    Note Endpoints
    - ✅ GET /api/notes: get a list of all notes for the authenticated user.
    - ✅ GET /api/notes/:id: get a note by ID for the authenticated user.
    - ✅ POST /api/notes: create a new note for the authenticated user.
    - ✅ PUT /api/notes/:id: update an existing note by ID for the authenticated user.
    - ✅ DELETE /api/notes/:id: delete a note by ID for the authenticated user.
    - ✅ POST /api/notes/:id/share: share a note with another user for the authenticated user.
    - ✅ GET /api/search?q=:query: search for notes based on keywords for the authenticated user.


# Technologies:
- For Runtime envirnoment,
    - NodeJS: cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser.
- For server,
    - ExpressJS: Web application framework for Node.js. It simplifies the process of building robust and scalable web applications.
- For DB,
    - MongoDB: Open-source NoSQL database that uses a document-oriented data model. It stores data in flexible, JSON-like BSON documents, making it highly scalable and suitable for a variety of applications.
- For security,
    - bcrypt: for hashing passwords securely
    - express-rate-limit: for rate-limiting requests
    - express-slow-down: for slowing down request rates
    - jsonwebtoken: for generating and verifying JSON Web Tokens (JWT)
- For validation,
    - joi: Object schema description language and validator for JavaScript objects. It is often used for input validation and ensuring data integrity.
- For testing,
    - Jest:  for writing tests and ensuring code quality.
    - Supertest: for testing HTTP assertions    

## ⚙ Installation

Follow these steps to set up Repo locally:

1. Clone the repository: 
```
git clone https://github.com/Maran1947/backend-notes-apis-assignment.git
```

2. Install the required dependencies:
```
cd backend-notes-apis-assignment
npm install
```

3. Set up the configuration file:
- Create an .env file in the root folder of the repo.
- Update the necessary environment variables in the `.env` file, such as database credentials and token secrets.
```
TEMPLATE: .env: 
PORT=8000
MONGODB_URI=<MONGODB_URI>
TEST_MONGODB_URI=<TEST_MONGODB_URI>
TOKEN_KEY=qpr@290_0^6ty
JWT_EXPIRES=1h
ACCESS_TOKEN_EXPIRES=60*1000
RF_EXPIRES=60*1000
REFRESH_TOKEN_SECRET=<REFRESH_TOKEN_SECRET>
ENCRYPT_RF_KEY=<ENCRYPT_RF_KEY>
ENCRYPT_RF_IV=<ENCRYPT_RF_IV>
```

- Run the following commands to generate REFRESH_TOKEN_SECRET, ENCRYPT_RF_KEY, and ENCRYPT_RF_IV
```
cd src/api/utils
node generateSecret.js
```

4. Start the server:
```
npm run dev 
```

5. Access server in your web browser at `http://localhost:8000`.

## 🛠 Testing APIs

- You can run any of the following commands:
```
npm test or npm run test
```

### NOTE: 
- Add an X-CSRF-TOKEN property to the headers that you will receive after a login/signup request when making requests to other APIs.
  
## APIs Endpoints
- BASE_URL = http://localhost:8000/api

- Auth Endpoints:
    - POST {{BASE_URL}}/auth/signup
        ```
            {
                "fullName":"Test user A",
                "email":"testa@test.com",
                "password":"Abc@1234"
            }
        
            Response:
            {
                "success": true,
                "message": "User registered successfully",
                "data": {
                    "email": "testa@test.com",
                    "csrfToken": "a425476c-47ab-49a5-9c21-d83d0c39f8f5"
                }
            }
        
           In the response headers, you will get the following cookies: _csrf, access_token, and refresh_token.
        ```
    - POST {{BASE_URL}}/auth/login
       ```
        {
            "email":"testa@test.com",
            "password":"Abc@1234"
        }
        ```
    - POST {{BASE_URL}}/auth/logout
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - POST {{BASE_URL}}/auth/refresh-token
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```

- Note Endpoints:
    - POST {{BASE_URL}}/notes
      ```
      {
        "title":"Test title",
        "content":"Test content" 
      }
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - GET {{BASE_URL}}/notes/:id
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - GET {{BASE_URL}}/notes
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - PUT {{BASE_URL}}/notes/:id
      ```
      {
        "title":"Test title update",
        "content":"Content note update"
      }
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - DELETE {{BASE_URL}}/notes/:id
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
    - POST {{BASE_URL}}/notes/:id/share
      ```
      {
        "sharedUserId":<USER_ID> // Specify the user ID of the user with whom the current user wants to share their note.
      }
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
- Search notes Endpoint:
    - GET {{BASE_URL}}/search?q=:query
      ```
      In Headers,
      X-CSRF-TOKEN=<X-CSRF-TOKEN>
      ```
