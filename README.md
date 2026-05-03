# 👋 Welcome to TaskFlow!

Hey there! Thanks for checking out **TaskFlow**. This is a full-stack web application designed to help teams easily create projects, assign tasks, and track their progress seamlessly. Whether you're an Admin managing the big picture or a Team Member focusing on your assigned work, TaskFlow keeps everything organized and moving forward.

## ✨ What can it do?

- **Secure Access**: Jump right in with safe and secure JWT-based login and signup.
- **Smart Role-Based Permissions**: 
  - 👑 *Admins* have the keys to the castle! They can create projects, manage the team, assign tasks, and keep everything on track.
  - 🧑‍💻 *Members* get a personalized, focused view. They can easily see the projects they're a part of and smoothly update the status of their assigned tasks.
- **Collaborative Project Management**: Spin up new projects and invite your team members in seconds.
- **Visual Task Tracking**: Keep tasks organized with our Kanban-style status tracking (To Do, In Progress, Done, Overdue).
- **Live Dashboard**: Get a bird's-eye view of what's happening with real-time statistics on your active tasks and projects.
- **Easy Task Assignments**: Admins can assign tasks directly to team members by selecting them or just by typing their email!

## 🛠️ What's under the hood?

We've built this using modern, fast technologies:
- **Frontend**: React (Vite) for blazing fast performance, styled beautifully with Tailwind CSS, and animated with Framer Motion. We also use React Router for smooth navigation.
- **Backend**: A robust API powered by Node.js and Express.js.
- **Database**: MongoDB (with Mongoose) to keep all your data safely stored.

## 🚀 Deploying to the world (Railway)

Ready to take it live? This project is completely configured and ready to be deployed on Railway!

1. Connect your GitHub repository to your Railway account.
2. Railway will automatically detect the root `package.json` file and install all the necessary dependencies for you.
3. Don't forget to add these **Environment Variables** in your Railway project settings:
   - `MONGO_URI`: Your MongoDB connection string (like the one from MongoDB Atlas).
   - `JWT_SECRET`: A secure, random string used for generating authentication tokens.
   - `NODE_ENV`: Set this to `production`.
4. That's it! Railway will run the `build` script and then the `start` script. It will automatically serve both the backend API and the static React frontend from the very same port.

## 💻 Running it locally

Want to play around with the code on your own machine? It's super easy:

1. **Clone the repository** to your local machine.
2. **Install everything you need** by running:
   ```bash
   npm run install-all
   ```
3. **Set up your environment**:
   Head over to the `backend` folder and create a file named `.env`. Add the following lines to it:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretjwtkey_12345
   NODE_ENV=development
   ```
4. **Fire it up!**
   ```bash
   npm run dev
   ```
   This magic command will concurrently start both the backend server (on port 5000) and the awesome Vite frontend server (on port 5173). 

Happy tracking! 🎉
#
