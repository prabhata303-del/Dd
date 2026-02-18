
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  className?: string;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = '',
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword && !showPassword ? 'password' : props.type || 'text';

  return (
    <div className="relative mb-5">
      {label && (
        <label className="text-sm text-gray-700 font-semibold mb-1 block ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <i className={`fas ${icon} absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors duration-300`}></i>
        )}
        <input
          type={inputType}
          className={`w-full py-4 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-base outline-none transition-all duration-300 focus:bg-white focus:border-primary focus:shadow-purple-md text-gray-800 ${
            icon ? 'pl-12' : 'pl-4'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 cursor-pointer`}
            onClick={() => setShowPassword(prev => !prev)}
          ></i>
        )}
      </div>
    </div>
  );
};

export default Input;
