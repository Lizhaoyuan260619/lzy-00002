import type { Book, MonthlyStats, CategoryStats, RatingStats } from '@/types';
import { getMonthKey } from './storage';

export const calculateMonthlyStats = (books: Book[]): MonthlyStats[] => {
  const statsMap = new Map<string, { completed: number; added: number }>();

  const currentYear = new Date().getFullYear();

  for (let month = 1; month <= 12; month++) {
    const monthKey = `${currentYear}-${String(month).padStart(2, '0')}`;
    statsMap.set(monthKey, { completed: 0, added: 0 });
  }

  books.forEach((book) => {
    const addedMonth = getMonthKey(book.createdAt);
    if (statsMap.has(addedMonth)) {
      const current = statsMap.get(addedMonth)!;
      current.added += 1;
      statsMap.set(addedMonth, current);
    }

    if (book.completedAt) {
      const completedMonth = getMonthKey(book.completedAt);
      if (statsMap.has(completedMonth)) {
        const current = statsMap.get(completedMonth)!;
        current.completed += 1;
        statsMap.set(completedMonth, current);
      }
    }
  });

  return Array.from(statsMap.entries()).map(([month, data]) => ({
    month: month.replace(`${currentYear}-`, ''),
    completed: data.completed,
    added: data.added
  }));
};

export const calculateCategoryStats = (books: Book[]): CategoryStats[] => {
  const statsMap = new Map<string, number>();

  books.forEach((book) => {
    const count = statsMap.get(book.category) || 0;
    statsMap.set(book.category, count + 1);
  });

  return Array.from(statsMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

export const calculateRatingStats = (books: Book[]): RatingStats[] => {
  const stats: RatingStats[] = [
    { rating: 1, count: 0 },
    { rating: 2, count: 0 },
    { rating: 3, count: 0 },
    { rating: 4, count: 0 },
    { rating: 5, count: 0 }
  ];

  books.forEach((book) => {
    if (book.rating >= 1 && book.rating <= 5) {
      const index = book.rating - 1;
      stats[index].count += 1;
    }
  });

  return stats.filter((s) => s.count > 0);
};

export const getOverviewStats = (books: Book[]) => {
  const total = books.length;
  const completed = books.filter((b) => b.readingStatus === 'completed').length;
  const reading = books.filter((b) => b.readingStatus === 'reading').length;
  const unread = books.filter((b) => b.readingStatus === 'unread').length;
  const ratedBooks = books.filter((b) => b.rating > 0);
  const avgRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
      : 0;

  return {
    total,
    completed,
    reading,
    unread,
    avgRating: Number(avgRating.toFixed(1))
  };
};

export const getRecentCompletedBooks = (books: Book[], limit = 5): Book[] => {
  return books
    .filter((b) => b.readingStatus === 'completed' && b.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, limit);
};
