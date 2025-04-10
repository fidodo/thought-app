# Step 1: Clone the repository using the project's Git URL.
git clone thought-app

# Step 2: Navigate to the project directory.
cd thought-app

# Step 3: Install the necessary dependencies.
npm i

note you will need to add .env file 
# .env.example

# App Config
NODE_ENV=development
PORT=3000

# PostgreSQL Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=your_db_name

# Firebase Config
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your_project.iam.gserviceaccount.com

# Optional
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info


# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
