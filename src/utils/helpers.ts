export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateROI = (
  totalInvestment: number,
  dailyRate: number,
  maxReturn: number
): {
  dailyEarning: number;
  maxEarning: number;
  daysToComplete: number;
} => {
  const dailyEarning = (totalInvestment * dailyRate) / 100;
  const maxEarning = (totalInvestment * maxReturn) / 100;
  const daysToComplete = Math.ceil(maxEarning / dailyEarning);

  return {
    dailyEarning,
    maxEarning,
    daysToComplete
  };
};

export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (!hasUpperCase || !hasLowerCase) {
    return {
      isValid: false,
      message: 'Password must contain both uppercase and lowercase letters'
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character (!@#$%^&*)'
    };
  }

  return {
    isValid: true,
    message: 'Password is valid'
  };
};

export const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
