import { useState, useEffect } from 'react';
import { Star, BookOpen, User, Tag, Calendar, BookMarked } from 'lucide-react';
import type { Book, BookFormData } from '@/types';
import { CATEGORIES, READING_STATUS_LABELS } from '@/types';
import type { ReadingStatus } from '@/types';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

const defaultFormData: BookFormData = {
  title: '',
  author: '',
  category: CATEGORIES[0],
  publishYear: new Date().getFullYear(),
  readingStatus: 'unread' as ReadingStatus,
  rating: 0,
  coverImage: ''
};

export default function BookForm({ initialData, onSubmit, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        category: initialData.category,
        publishYear: initialData.publishYear,
        readingStatus: initialData.readingStatus,
        rating: initialData.rating,
        coverImage: initialData.coverImage || ''
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入书名';
    }
    if (!formData.author.trim()) {
      newErrors.author = '请输入作者';
    }
    if (!formData.category.trim()) {
      newErrors.category = '请选择分类';
    }
    if (!formData.publishYear || formData.publishYear < 1000 || formData.publishYear > new Date().getFullYear()) {
      newErrors.publishYear = `请输入有效的出版年份（1000-${new Date().getFullYear()}）`;
    }
    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = '请输入有效的图片URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <BookOpen className="w-4 h-4" />
          书名 <span className="text-terracotta-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="请输入书名"
          className={`input-field ${errors.title ? 'border-terracotta-400 focus:ring-terracotta-400' : ''}`}
        />
        {errors.title && <p className="text-xs text-terracotta-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <User className="w-4 h-4" />
          作者 <span className="text-terracotta-500">*</span>
        </label>
        <input
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="请输入作者"
          className={`input-field ${errors.author ? 'border-terracotta-400 focus:ring-terracotta-400' : ''}`}
        />
        {errors.author && <p className="text-xs text-terracotta-500 mt-1">{errors.author}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
            <Tag className="w-4 h-4" />
            分类 <span className="text-terracotta-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field appearance-none bg-no-repeat bg-right cursor-pointer"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23A67B5B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
              backgroundSize: '20px',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
            <Calendar className="w-4 h-4" />
            出版年份 <span className="text-terracotta-500">*</span>
          </label>
          <input
            type="number"
            value={formData.publishYear}
            onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || 0 })}
            placeholder="2024"
            min="1000"
            max={new Date().getFullYear()}
            className={`input-field ${errors.publishYear ? 'border-terracotta-400 focus:ring-terracotta-400' : ''}`}
          />
          {errors.publishYear && (
            <p className="text-xs text-terracotta-500 mt-1">{errors.publishYear}</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <BookMarked className="w-4 h-4" />
          阅读状态 <span className="text-terracotta-500">*</span>
        </label>
        <div className="flex gap-2">
          {(Object.keys(READING_STATUS_LABELS) as ReadingStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFormData({ ...formData, readingStatus: status })}
              className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all ${
                formData.readingStatus === status
                  ? status === 'unread'
                    ? 'bg-brown-600 text-white shadow-soft'
                    : status === 'reading'
                    ? 'bg-forest-600 text-white shadow-soft'
                    : 'bg-terracotta-500 text-white shadow-soft'
                  : 'bg-brown-50 text-brown-600 hover:bg-brown-100'
              }`}
            >
              {READING_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <Star className="w-4 h-4 text-terracotta-500" />
          个人评分
          {formData.rating > 0 && (
            <span className="text-terracotta-500 ml-1">{formData.rating} 星</span>
          )}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  rating <= formData.rating
                    ? 'text-terracotta-500 fill-terracotta-500'
                    : 'text-brown-200 hover:text-brown-400'
                }`}
              />
            </button>
          ))}
          {formData.rating > 0 && (
            <button
              type="button"
              onClick={() => setFormData({ ...formData, rating: 0 })}
              className="ml-2 text-sm text-brown-400 hover:text-brown-600 transition-colors"
            >
              清除
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          封面图片 URL（可选）
        </label>
        <input
          type="url"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          placeholder="https://example.com/cover.jpg"
          className={`input-field ${errors.coverImage ? 'border-terracotta-400 focus:ring-terracotta-400' : ''}`}
        />
        {errors.coverImage && (
          <p className="text-xs text-terracotta-500 mt-1">{errors.coverImage}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          取消
        </button>
        <button type="submit" className="btn-primary flex-1">
          {initialData ? '保存修改' : '添加图书'}
        </button>
      </div>
    </form>
  );
}
