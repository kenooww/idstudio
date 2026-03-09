import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import IDCardStudio from './components/IDCardStudio';

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <IDCardStudio /> : <LoginForm />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
