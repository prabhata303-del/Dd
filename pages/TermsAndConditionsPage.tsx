
import React from 'react';
import { PageId } from '../App';
import PageHeader from '../components/shared/PageHeader';

interface TermsAndConditionsPageProps {
  showPage: (pageId: PageId) => void;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ showPage }) => {
  return (
    <div className="absolute inset-0 bg-secondary flex flex-col z-10">
      <PageHeader title="Terms & Conditions" showPage={showPage} backTarget="loginPage" />
      <div className="flex-1 p-5 overflow-y-auto text-sm leading-relaxed">
        <h3 className="text-primary mt-0">Terms and Conditions</h3>
        <p><strong>Shuvidha Seva</strong> app ka istemal karne ke liye aapko niche diye gaye niyamo (terms) ka palan karna hoga:</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">1. Minimum Order Rule</h4>
        <p>App se order karne ke liye kam se kam <strong className="text-danger">3 items</strong> aur kul rashi <strong className="text-danger">₹50.00</strong> se zyada honi chahiye।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">2. Delivery Charges</h4>
        <p>Har order par <strong className="text-danger">₹10 fixed delivery charge</strong> liya jayega, chahe order kitna bhi bada ho।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">3. Per Item Quantity Rule (Max 5)</h4>
        <p>Aap ek hi product ki zyada se zyada <strong className="text-danger">5 quantity</strong> order kar sakte hain।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">4. Account Responsibility</h4>
        <p>Aap apne mobile number aur password ki suraksha ke liye khud zimmedar hain। Galat jankari dene par account band kiya ja sakta hai।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">5. Delivery Time</h4>
        <p>Hum koshish karte hain ki order jaldi deliver ho, lekin mausam ya traffic ki wajah se deri ho sakti hai।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">6. Order Cancellation</h4>
        <p>Order place hone ke baad agar humne saaman pack kar diya hai, toh cancellation swikar nahi kiya jayega।</p>

        <h4 className="text-primary font-bold mt-4 mb-1.5">7. Contact Us</h4>
        <p>Kisi bhi shikayat ya sawal ke liye aap humein <strong className="text-primary">shuvidhaseva1@gmail.com</strong> par email kar sakte hain।</p>

        <div className="text-center mt-8 text-sm text-light-text">
          &copy; 2026 Shuvidha Seva. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
