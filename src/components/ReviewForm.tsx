import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import type { Review, ReviewFormData } from '@/types';

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
}

export default function ReviewForm({ initialData, onSubmit, onCancel }: ReviewFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('请输入书评内容');
      return;
    }
    if (rating === 0) {
      setError('请选择评分');
      return;
    }
    onSubmit({ content: content.trim(), rating });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <Star className="w-4 h-4 text-terracotta-500" />
          书评评分 <span className="text-terracotta-500">*</span>
          {rating > 0 && (
            <span className="text-terracotta-500 ml-1">{rating} 星</span>
          )}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r === rating ? 0 : r)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  r <= rating
                    ? 'text-terracotta-500 fill-terracotta-500'
                    : 'text-brown-200 hover:text-brown-400'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <button
              type="button"
              onClick={() => setRating(0)}
              className="ml-2 text-sm text-brown-400 hover:text-brown-600 transition-colors"
            >
              清除
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-brown-700 mb-2">
          <MessageSquare className="w-4 h-4" />
          书评内容 <span className="text-terracotta-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError('');
          }}
          placeholder="写下你对这本书的感想..."
          rows={4}
          className={`input-field resize-none ${
            error ? 'border-terracotta-400 focus:ring-terracotta-400' : ''
          }`}
        />
        {error && <p className="text-xs text-terracotta-500 mt-1">{error}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          取消
        </button>
        <button type="submit" className="btn-primary flex-1">
          {initialData ? '保存修改' : '发表书评'}
        </button>
      </div>
    </form>
  );
}
