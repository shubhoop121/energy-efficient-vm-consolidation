import { useState, useEffect } from 'react';

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

export const usePasswordStrength = (password: string): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500',
    suggestions: [],
  });

  useEffect(() => {
    const calculateStrength = (pwd: string): PasswordStrength => {
      let score = 0;
      const suggestions: string[] = [];

      if (pwd.length === 0) {
        return {
          score: 0,
          label: 'Enter password',
          color: 'bg-gray-400',
          suggestions: ['Password is required'],
        };
      }

      // Length check
      if (pwd.length >= 8) score += 1;
      else suggestions.push('Use at least 8 characters');

      // Lowercase check
      if (/[a-z]/.test(pwd)) score += 1;
      else suggestions.push('Include lowercase letters');

      // Uppercase check
      if (/[A-Z]/.test(pwd)) score += 1;
      else suggestions.push('Include uppercase letters');

      // Number check
      if (/\d/.test(pwd)) score += 1;
      else suggestions.push('Include numbers');

      // Special character check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;
      else suggestions.push('Include special characters');

      // Determine label and color
      let label = 'Very Weak';
      let color = 'bg-red-500';

      if (score >= 4) {
        label = 'Strong';
        color = 'bg-green-500';
      } else if (score >= 3) {
        label = 'Good';
        color = 'bg-yellow-500';
      } else if (score >= 2) {
        label = 'Fair';
        color = 'bg-orange-500';
      } else if (score >= 1) {
        label = 'Weak';
        color = 'bg-red-400';
      }

      return { score, label, color, suggestions };
    };

    setStrength(calculateStrength(password));
  }, [password]);

  return strength;
};