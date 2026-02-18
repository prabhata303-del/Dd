
import React, { useState, useEffect } from 'react';
import { PageId } from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthCard from '../components/shared/AuthCard';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  showPage: (pageId: PageId) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ showPage }) => {
  const { login, googleSignIn, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error); // Sync auth context error
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    try {
      await login(email, password);
      // AuthContext will handle page redirection via onAuthStateChanged
    } catch (err) {
      // Error already set by AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    clearError();
    try {
      await googleSignIn();
      // AuthContext will handle page redirection
    } catch (err) {
      // Error already set by AuthContext
    }
  };

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <AuthCard headerContent={{ title: 'Welcome Back', description: 'Sign in with your Email and Password', showLogo: true }}>
        {localError && (
          <p className="text-danger text-center mb-4 text-sm bg-red-100 p-2 rounded-lg">
            {localError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="* EMAIL ADDRESS"
            type="email"
            icon="fa-envelope"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Input
            label="* PASSWORD"
            isPassword
            icon="fa-lock"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" className="mt-4 mb-4" isLoading={isLoading} disabled={isLoading}>
            Login to Shuvidha Seva
          </Button>
        </form>

        <div className="flex items-center text-center text-gray-500 my-6 font-semibold text-sm tracking-wide before:flex-1 before:border-b before:border-gray-200 before:mr-4 after:flex-1 after:border-b after:border-gray-200 after:ml-4">
          OR
        </div>

        <Button
          variant="google"
          onClick={handleGoogleLogin}
          className="mb-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 mr-2" />
          Sign in with Google
        </Button>

        <div className="text-center mt-2 text-sm text-gray-700">
          Don't have an account?{' '}
          <a href="#" className="text-primary font-semibold no-underline" onClick={() => showPage('registerPage')}>
            Register
          </a>
        </div>
        <div className="text-center mt-5 text-xs text-gray-700">
          By logging in, you agree to our{' '}
          <a href="#" className="text-primary no-underline" onClick={() => showPage('termsPage')}>
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary no-underline" onClick={() => showPage('privacyPage')}>
            Privacy Policy
          </a>
          .
        </div>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
