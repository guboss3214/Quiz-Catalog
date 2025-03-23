# Quiz Application

## Task Completion Status

### Core Features ✅

- [x] Create questionnaire functionality
- [x] Edit questionnaire capability
- [x] Delete questionnaire with confirmation
- [x] Run questionnaire interface
- [x] Save questionnaire responses
- [x] Track completion time
- [x] Display completion statistics

### User Interface 🎨

- [x] Modern, responsive design
- [x] Interactive form elements
- [x] Loading states
- [x] Error handling with user feedback
- [x] Confirmation modals
- [x] Clean navigation

### Technical Implementation 🛠

- [x] MongoDB integration
- [x] Express backend API
- [x] React frontend with TypeScript
- [x] Tailwind CSS styling
- [x] Environment variable configuration
- [x] Axios HTTP client setup

### Additional Features 🌟

- [x] Question type support (Text, Single choice, Multiple choice)
- [x] Real-time form validation
- [x] Dynamic question management
- [x] Automatic data refresh
- [x] Completion counter

### Upcoming Features 🚀

- [ ] User authentication
- [ ] Result analytics
- [ ] Export questionnaire data
- [ ] Rich text editing
- [ ] Image upload support

## Getting Started

This project consists of a frontend built with React/TypeScript and a backend using Express/MongoDB. Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend root directory:

```env
VITE_REACT_APP_API_URL=http://localhost:3001
```

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend root directory:

```env
PORT=3001
DB_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
```

4. Start the server:

```bash
npm start
```

The backend will be running at `http://localhost:3001`

### Environment Variables

#### Frontend (.env)

- `VITE_REACT_APP_API_URL`: URL of your backend API

#### Backend (.env)

- `PORT`: Port number for the backend server
- `DB_URL`: MongoDB connection string
- `FRONTEND_URL`: URL of your frontend application

### Deployed Version

The application is deployed and accessible at:

- Frontend: https://frontend-4t79v23wl-yuriis-projects-b695266c.vercel.app/
- Backend: https://backend-quiz-catalog.onrender.com

### Additional Notes

- For local development, make sure both frontend and backend servers are running
- MongoDB connection string can be obtained from MongoDB Atlas
- Ensure all environment variables are properly set before starting the servers
