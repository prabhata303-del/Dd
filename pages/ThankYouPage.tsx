
import React from 'react';
import { PageId } from '../App';
import Button from '../components/ui/Button';

interface ThankYouPageProps {
  showPage: (pageId: PageId) => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ showPage }) => {
  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <div className="flex flex-col justify-center items-center h-full p-10 text-center">
        <div className="w-25 h-25 bg-blue-50 rounded-full flex justify-center items-center mb-5">
          <i className="fas fa-check text-5xl text-primary"></i>
        </div>
        <h2 className="text-gray-900">Order Placed!</h2>
        <p className="text-gray-600">Your food is being prepared by Shuvidha Seva. Check your email for confirmation! (Simulated)</p>
        <Button className="mt-8" onClick={() => showPage('ordersPage')}>
          Track Order
        </Button>
        <a href="#" className="mt-5 block text-light-text no-underline" onClick={() => showPage('appContainer')}>
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYouPage;
