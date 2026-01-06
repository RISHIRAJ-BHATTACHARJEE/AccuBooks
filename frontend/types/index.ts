// User type
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Category type
export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'purchase';
  color: string;
  created_at: string;
}

// Income type
export interface Income {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  categories?: Category;
}

// Purchase type
export interface Purchase {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  amount: number;
  date: string;
  created_at: string;
  categories?: Category;
}

// Analytics types
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface CategoryData {
  name: string;
  total: number;
  color: string;
}

export interface TrendData {
  month: string;
  income: number;
  expenses: number;
}
