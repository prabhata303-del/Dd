
import React from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';

interface PrivacyPolicyPageProps {
  showPage: (pageId: PageId) => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ showPage }) => {
  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="Privacy Policy" showPage={showPage} backTarget="loginPage" />
      <div className="flex-1 p-5 overflow-y-auto text-sm leading-relaxed">
        <h3 className="text-primary mt-0">App & Developer Information</h3>
        <ul className="list-none p-0 mb-5">
          <li><strong>Application Name:</strong> Shuvidha Seva</li>
          <li><strong>Package ID:</strong> com.shuvidha.seva</li>
          <li><strong>Developer:</strong> Prabhat Acharya</li>
          <li><strong>Contact Email:</strong> shuvidhaseva1@gmail.com</li>
          <li><strong>Last Updated:</strong> 03 February 2026</li>
        </ul>

        <h3 className="text-primary mt-0">Privacy Policy - Shuvidha Seva</h3>
        <p>Aapki privacy hamare liye bahut mahatvapurn hai। Yeh policy batati hai ki <strong>Shuvidha Seva</strong> aapka data kaise collect aur istemal karta hai।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">1. Data Jo Hum Collect Karte Hain</h4>
        <p>Hum sirf wahi jankari lete hain jo aapke order ko deliver karne ke liye zaruri hai:</p>
        <ul className="ml-5 mt-[-5px] list-disc">
          <li>Aapka Naam</li>
          <li>Mobile Number</li>
          <li>Email Address</li>
          <li>Delivery Address (Ghar ka pata)</li>
        </ul>

        <h4 className="text-primary font-bold mt-4 mb-1.5">2. Data Ka Istemal</h4>
        <p>Aapka data sirf niche diye gaye kaamo ke liye use hota hai:</p>
        <ul className="ml-5 mt-[-5px] list-disc">
          <li>Aapke order ko process aur deliver karne ke liye।</li>
          <li>Aapko order status updates bhejne ke liye।</li>
          <li>App ki service ko behtar banane ke liye।</li>
        </ul>

        <h4 className="text-primary font-bold mt-4 mb-1.5">3. Data Security</h4>
        <p>Hum aapka personal data kisi bhi third-party ko bechte ya share nahi karte hain। Aapka data puri tarah surakshit hai।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">4. Order Rules</h4>
        <p>Shuvidha Seva par order karne ke liye minimum 3 items aur ₹50 ka order, aur maximum 5 quantity per item ka order hona anivarya hai। Har order par ₹10 delivery charge liya jayega।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">5. Contact Us</h4>
        <p>Agar aapko koi sawal hai, toh aap humse <strong className="text-primary">shuvidhaseva1@gmail.com</strong> par sampark kar sakte hain ya app ke support section mein message karein।</p>

        <div className="text-center mt-8 text-sm text-light-text">
          <p>&copy; 2026 Shuvidha Seva. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
