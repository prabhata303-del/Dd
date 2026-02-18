
import React, { useState, useEffect } from 'react';
import { PageId } from '../App';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthCard from '../components/shared/AuthCard';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  showPage: (pageId: PageId) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ showPage }) => {
  const { register, googleSignIn, error, clearError, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error); // Sync auth context error
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name || !mobile || !email || !password || !confirmPassword || !pincode || !state || !district || !addressLine) {
      setLocalError("All fields marked with * are required.");
      return;
    }
    if (mobile.length !== 10 || isNaN(Number(mobile))) {
      setLocalError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setLocalError("Please enter a valid 6-digit pincode.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match. Please try again.");
      return;
    }

    try {
      await register(name, mobile, email, password, confirmPassword, pincode, state, district, addressLine);
      // AuthContext will handle page redirection via onAuthStateChanged
    } catch (err) {
      // Error already set by AuthContext
    }
  };

  const handleGoogleRegister = async () => {
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
      <AuthCard headerContent={{ title: 'Create Account', description: 'Join the Shuvidha Seva community today!', showLogo: true }}>
        {localError && (
          <p className="text-danger text-center mb-4 text-sm bg-red-100 p-2 rounded-lg">
            {localError}
          </p>
        )}
        <p className="text-sm text-danger text-center mb-5">* All fields are required</p>

        <form onSubmit={handleSubmit}>
          <Input label="* FULL NAME" type="text" icon="fa-user" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
          <Input label="* MOBILE NUMBER" type="tel" icon="fa-mobile-alt" placeholder="9876543210" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value)} required disabled={isLoading} />
          <Input label="* EMAIL ADDRESS" type="email" icon="fa-envelope" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
          <Input label="* PASSWORD" isPassword icon="fa-lock" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          <Input label="* CONFIRM PASSWORD" isPassword icon="fa-lock" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />

          <h3 className="text-lg font-bold mt-8 mb-4 text-primary">Delivery Address</h3>
          <Input label="* PINCODE" type="tel" placeholder="Enter Pincode" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value)} required disabled={isLoading} />
          <Input label="* STATE" type="text" placeholder="State Name" value={state} onChange={(e) => setState(e.target.value)} required disabled={isLoading} />
          <Input label="* DISTRICT" type="text" placeholder="District Name" value={district} onChange={(e) => setDistrict(e.target.value)} required disabled={isLoading} />
          <Input label="* VILLAGE / BUILDING / HOUSE" type="text" placeholder="Flat No, Building Name, Village" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required disabled={isLoading} />

          <Button type="submit" className="mt-6 mb-4" isLoading={isLoading} disabled={isLoading}>
            Sign Up Now
          </Button>
        </form>

        <div className="flex items-center text-center text-gray-500 my-4 font-semibold text-sm tracking-wide before:flex-1 before:border-b before:border-gray-200 before:mr-4 after:flex-1 after:border-b after:border-gray-200 after:ml-4">
          OR
        </div>

        <Button
          variant="google"
          onClick={handleGoogleRegister}
          className="mb-4"
          isLoading={isLoading}
          disabled={isLoading}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-5 mr-2" />
          Sign up with Google
        </Button>

        <div className="text-center mt-2 text-sm text-gray-700">
          Already have an account?{' '}
          <a href="#" className="text-primary font-semibold no-underline" onClick={() => showPage('loginPage')}>
            Login
          </a>
          <p className="mt-2 text-sm">
            Forgot your password?{' '}
            <a href="#" className="text-primary no-underline" onClick={() => alert('Password reset link has been sent to your email (Simulated).')}>
              Reset Password
            </a>
          </p>
        </div>
        <div className="text-center mt-5 text-xs text-gray-700">
          By signing up, you agree to our{' '}
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

export default RegisterPage;
