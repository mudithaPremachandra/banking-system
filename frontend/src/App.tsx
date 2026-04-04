// import React removed
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRouter } from './router/AppRouter';
import { Navbar } from './components/Navbar';
import { VideoBackground } from './components/VideoBackground';

function App() {
  return (
    <BrowserRouter>
      {/* Single persistent video — lives outside router so it NEVER re-mounts on navigation */}
      <VideoBackground
        src="/bg-video.mp4"
        overlayOpacity={0.85}
      />
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <AppRouter />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
