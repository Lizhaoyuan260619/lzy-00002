import { create } from 'zustand';
import type { Book, ReadingStatus, BookFormData, ReviewFormData } from '@/types';
import {
  loadBooksFromStorage,
  saveBooksToStorage,
  generateId,
  getCurrentDate
} from '@/utils/storage';

interface BookStore {
  books: Book[];
  isInitialized: boolean;
  init: () => void;
  addBook: (bookData: BookFormData) => void;
  updateBook: (id: string, bookData: Partial<BookFormData>) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  searchBooks: (query: string) => Book[];
  filterBooks: (category?: string, status?: ReadingStatus) => Book[];
  getFilteredBooks: (searchQuery: string, category?: string, status?: ReadingStatus) => Book[];
  addReview: (bookId: string, reviewData: ReviewFormData) => void;
  updateReview: (bookId: string, reviewId: string, reviewData: ReviewFormData) => void;
  deleteReview: (bookId: string, reviewId: string) => void;
}

const MOCK_BOOKS: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    category: '文学小说',
    publishYear: 1967,
    readingStatus: 'completed',
    rating: 5,
    reviews: [
      {
        id: generateId(),
        content: '魔幻现实主义的巅峰之作，马孔多的兴衰让人感慨万千。布恩迪亚家族七代人的命运交织，时间在这里仿佛是一个永恒的轮回。',
        rating: 5,
        createdAt: '2026-01-20T00:00:00.000Z',
        updatedAt: '2026-01-20T00:00:00.000Z'
      }
    ],
    completedAt: '2026-01-15T00:00:00.000Z'
  },
  {
    title: '深入理解计算机系统',
    author: 'Randal E. Bryant',
    category: '科技编程',
    publishYear: 2015,
    readingStatus: 'reading',
    rating: 4,
    reviews: []
  },
  {
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    category: '历史传记',
    publishYear: 2014,
    readingStatus: 'completed',
    rating: 5,
    reviews: [
      {
        id: generateId(),
        content: '以宏观视角审视人类历史，从认知革命到科技革命，每一章都让人重新思考我们是谁、从哪里来。',
        rating: 5,
        createdAt: '2026-02-25T00:00:00.000Z',
        updatedAt: '2026-02-25T00:00:00.000Z'
      }
    ],
    completedAt: '2026-02-20T00:00:00.000Z'
  },
  {
    title: '原则',
    author: '瑞·达利欧',
    category: '经济管理',
    publishYear: 2017,
    readingStatus: 'unread',
    rating: 0,
    reviews: []
  },
  {
    title: '三体',
    author: '刘慈欣',
    category: '文学小说',
    publishYear: 2008,
    readingStatus: 'completed',
    rating: 5,
    reviews: [
      {
        id: generateId(),
        content: '中国科幻的里程碑，黑暗森林法则令人不寒而栗。宇宙社会学的设定宏大而自洽，读完后对宇宙充满了敬畏。',
        rating: 5,
        createdAt: '2026-03-15T00:00:00.000Z',
        updatedAt: '2026-03-15T00:00:00.000Z'
      },
      {
        id: generateId(),
        content: '第一次读时被震撼到说不出话，宏大的宇宙观和深刻的哲学思考交织在一起，是真正能改变世界观的作品。',
        rating: 5,
        createdAt: '2026-03-18T00:00:00.000Z',
        updatedAt: '2026-03-18T00:00:00.000Z'
      }
    ],
    completedAt: '2026-03-10T00:00:00.000Z'
  },
  {
    title: '活着',
    author: '余华',
    category: '文学小说',
    publishYear: 1993,
    readingStatus: 'completed',
    rating: 5,
    reviews: [],
    completedAt: '2026-03-25T00:00:00.000Z'
  },
  {
    title: '算法导论',
    author: 'Thomas H. Cormen',
    category: '科技编程',
    publishYear: 2009,
    readingStatus: 'unread',
    rating: 0,
    reviews: []
  },
  {
    title: '万历十五年',
    author: '黄仁宇',
    category: '历史传记',
    publishYear: 1981,
    readingStatus: 'reading',
    rating: 4,
    reviews: []
  }
];

const initializeWithMockData = (): Book[] => {
  const now = getCurrentDate();
  return MOCK_BOOKS.map((book) => ({
    ...book,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  }));
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  isInitialized: false,

  init: () => {
    const storedBooks = loadBooksFromStorage();
    if (storedBooks.length > 0) {
      const migratedBooks = storedBooks.map((book) => ({
        ...book,
        reviews: book.reviews || []
      }));
      saveBooksToStorage(migratedBooks);
      set({ books: migratedBooks, isInitialized: true });
    } else {
      const mockBooks = initializeWithMockData();
      saveBooksToStorage(mockBooks);
      set({ books: mockBooks, isInitialized: true });
    }
  },

  addBook: (bookData) => {
    const newBook: Book = {
      ...bookData,
      id: generateId(),
      reviews: [],
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
      completedAt: bookData.readingStatus === 'completed' ? getCurrentDate() : undefined
    };
    set((state) => {
      const newBooks = [...state.books, newBook];
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  },

  updateBook: (id, bookData) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id === id) {
          const updates: Partial<Book> = {
            ...bookData,
            updatedAt: getCurrentDate()
          };
          if (bookData.readingStatus === 'completed' && !book.completedAt) {
            updates.completedAt = getCurrentDate();
          } else if (bookData.readingStatus && bookData.readingStatus !== 'completed') {
            updates.completedAt = undefined;
          }
          return { ...book, ...updates };
        }
        return book;
      });
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  },

  deleteBook: (id) => {
    set((state) => {
      const newBooks = state.books.filter((book) => book.id !== id);
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  },

  getBookById: (id) => {
    return get().books.find((book) => book.id === id);
  },

  searchBooks: (query) => {
    if (!query.trim()) return get().books;
    const lowerQuery = query.toLowerCase();
    return get().books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
    );
  },

  filterBooks: (category, status) => {
    return get().books.filter((book) => {
      if (category && book.category !== category) return false;
      if (status && book.readingStatus !== status) return false;
      return true;
    });
  },

  getFilteredBooks: (searchQuery, category, status) => {
    let result = get().books;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery)
      );
    }

    if (category) {
      result = result.filter((book) => book.category === category);
    }

    if (status) {
      result = result.filter((book) => book.readingStatus === status);
    }

    return result;
  },

  addReview: (bookId, reviewData) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id === bookId) {
          const now = getCurrentDate();
          return {
            ...book,
            reviews: [
              ...book.reviews,
              {
                id: generateId(),
                content: reviewData.content,
                rating: reviewData.rating,
                createdAt: now,
                updatedAt: now
              }
            ],
            updatedAt: now
          };
        }
        return book;
      });
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  },

  updateReview: (bookId, reviewId, reviewData) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id === bookId) {
          const now = getCurrentDate();
          return {
            ...book,
            reviews: book.reviews.map((review) =>
              review.id === reviewId
                ? { ...review, ...reviewData, updatedAt: now }
                : review
            ),
            updatedAt: now
          };
        }
        return book;
      });
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  },

  deleteReview: (bookId, reviewId) => {
    set((state) => {
      const newBooks = state.books.map((book) => {
        if (book.id === bookId) {
          const now = getCurrentDate();
          return {
            ...book,
            reviews: book.reviews.filter((review) => review.id !== reviewId),
            updatedAt: now
          };
        }
        return book;
      });
      saveBooksToStorage(newBooks);
      return { books: newBooks };
    });
  }
}));
