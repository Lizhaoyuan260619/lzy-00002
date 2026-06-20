import type { Book } from '@/types';

const STORAGE_KEY = 'personal-library-books';

export const loadBooksFromStorage = (): Book[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load books from localStorage:', error);
  }
  return [];
};

export const saveBooksToStorage = (books: Book[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Failed to save books to localStorage:', error);
  }
};

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getMonthKey = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
