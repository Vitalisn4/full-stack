import { Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useSessionTimeout } from './hooks/useSessionTimeout'; // Ensure this import is here

function App() {
  // Call the session timeout hook here. It will internally handle
  // everything based on the authentication state.
  useSessionTimeout();

  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect to login for any other path */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;