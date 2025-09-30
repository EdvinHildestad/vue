# 🧠 Daily Quiz Games

A modern Vue.js web application for daily quiz challenges with user profiles, competitions, and leaderboards.

## ✨ Features

- **Daily Quiz Games**: Fresh quizzes every day across multiple topics
- **User Profiles**: Create accounts and track your progress
- **Competition System**: Compete with other players on leaderboards
- **Attempt Tracking**: Monitor your quiz attempts and improvement
- **Responsive Design**: Works perfectly on desktop and mobile
- **Static Deployment**: Easy to deploy to GitHub Pages, Netlify, or Vercel

## 🚀 Quick Start

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup (Optional)

The app works with mock data by default, but you can run the Python backend for full functionality:

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## 🎮 How to Play

1. **Create an Account**: Sign up with a username and password
2. **Choose a Quiz**: Select from available daily quizzes
3. **Answer Questions**: Click on your answer choice and confirm
4. **View Results**: See your score and correct answers
5. **Check Leaderboard**: Compare your performance with other players
6. **Track Progress**: Monitor your improvement in your profile

## 🏗️ Project Structure

```
vue-quiz-app/
├── src/
│   ├── components/         # Reusable Vue components
│   ├── views/             # Page components
│   ├── stores/            # Pinia state management
│   ├── api/               # API service layer
│   ├── router.js          # Vue Router configuration
│   ├── main.js           # App entry point
│   └── style.css         # Global styles
├── backend/              # Python FastAPI backend
│   ├── main.py          # API server
│   └── requirements.txt # Python dependencies
├── .github/workflows/   # CI/CD configurations
└── public/             # Static assets
```

## 🎯 Game Features

### Quiz System
- Multiple choice questions
- Instant feedback on answers
- Score tracking and calculation
- Progress indicators
- Attempt counting

### User Management
- Account creation and login
- Profile customization
- Statistics tracking
- Achievement system

### Competition Features
- Real-time leaderboards
- Ranking by score and accuracy
- Performance comparison
- Achievement badges

## 🚀 Deployment

### GitHub Pages

1. Enable GitHub Pages in your repository settings
2. Push your code to the main branch
3. The GitHub Actions workflow will automatically build and deploy

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Vue.js and configure build settings
3. Deploy automatically on push

## 🛠️ Development

### Tech Stack

**Frontend:**
- Vue 3 with Composition API
- Vue Router for navigation
- Pinia for state management
- Vite for build tooling
- Modern CSS with Flexbox/Grid

**Backend (Optional):**
- FastAPI (Python)
- Pydantic for data validation
- SQLite for data storage
- JWT for authentication

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:8000
```

## 📱 Mobile Support

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🎨 Customization

### Adding New Quizzes

Edit the mock data in `src/api/index.js` or create new quizzes through the backend API.

### Styling

The app uses modern CSS with CSS custom properties for easy theming. Main styles are in:
- `src/style.css` - Global styles
- Component `<style scoped>` sections - Component-specific styles

### Features

The modular architecture makes it easy to add new features:
- Add new quiz types
- Implement new game modes
- Add social features
- Integrate with external APIs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Demo

Try the live demo: [Your deployment URL here]

---

**Happy Quizzing!** 🧠✨