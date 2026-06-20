export type ReadingStatus = 'unread' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publishYear: number;
  readingStatus: ReadingStatus;
  rating: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  publishYear: number;
  readingStatus: ReadingStatus;
  rating: number;
  coverImage?: string;
}

export interface MonthlyStats {
  month: string;
  completed: number;
  added: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}

export interface RatingStats {
  rating: number;
  count: number;
}

export const CATEGORIES = [
  '文学小说',
  '科技编程',
  '历史传记',
  '经济管理',
  '哲学思想',
  '艺术设计',
  '生活休闲',
  '儿童读物',
  '其他'
] as const;

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  unread: '未读',
  reading: '在读',
  completed: '已读'
};
