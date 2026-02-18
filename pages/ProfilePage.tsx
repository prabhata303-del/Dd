
import React, { useState, useEffect } from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

interface ProfilePageProps {
  showPage: (pageId: PageId) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ showPage }) => {
  // Fix: Destructure isLoading as isAuthLoading from useAuth
  const { currentUser, userData, logout, isLoading: isAuthLoading, refetchUserData } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.profileImageUrl) {
      setProfileImage(userData.profileImageUrl);
    } else {
      setProfileImage(null);
    }
  }, [userData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        // In a real app, you would upload this to Firebase Storage and update userData.profileImageUrl
        // For now, this is a client-side preview matching original HTML behavior.
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showPage('loginPage');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Re-fetch user data if profile is opened and no data is present (e.g., after Google sign-up without address)
  useEffect(() => {
    if (currentUser && !userData && !isAuthLoading) {
      refetchUserData(currentUser);
    }
  }, [currentUser, userData, isAuthLoading, refetchUserData]);


  if (isAuthLoading) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col z-10">
        <PageHeader title="My Profile" showPage={showPage} backTarget="appContainer" variant="profile" />
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="My Profile" showPage={showPage} backTarget="appContainer" variant="profile" />
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="bg-white rounded-xl p-5 mb-5 shadow-sm text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-primary text-4xl relative overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <i className="fas fa-user"></i>
            )}
            <input
              type="file"
              id="profileImageUploadInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <a
            href="#"
            className="text-primary text-sm no-underline"
            onClick={(e) => { e.preventDefault(); document.getElementById('profileImageUploadInput')?.click(); }}
          >
            Change Photo
          </a>

          <h3 className="mt-2.5 mb-0 text-gray-900">{userData?.name || currentUser?.displayName || 'Guest User'}</h3>
          <p className="text-gray-600 text-sm mt-0.5">{userData?.email || currentUser?.email || 'N/A'}</p>
          <p className="text-gray-600 text-sm font-semibold mt-0.5">Mobile: {userData?.mobile || 'N/A'}</p>
          <p className="text-gray-600 text-sm mt-0.5">
            Address: {userData?.address?.line && userData?.address?.district && userData?.address?.state && userData?.pincode
              ? `${userData.address.line}, ${userData.address.district}, ${userData.address.state} - ${userData.pincode}`
              : 'N/A'}
          </p>

          <Button variant="danger" className="mt-5 w-1/2" onClick={handleLogout} disabled={isAuthLoading}>
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
