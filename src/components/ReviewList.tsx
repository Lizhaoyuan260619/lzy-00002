import { Star, Edit2, Trash2, MessageSquare } from 'lucide-react';
import type { Review } from '@/types';
import { formatDate } from '@/utils/storage';

interface ReviewListProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onEdit, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-brown-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-7 h-7 text-brown-300" />
        </div>
        <p className="text-brown-400 text-sm">还没有书评，快来写下你的感想吧</p>
      </div>
    );
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? 'text-terracotta-500 fill-terracotta-500' : 'text-brown-200'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-brown-50/60 rounded-xl p-4 border border-brown-100/60 group"
        >
          <div className="flex items-center justify-between mb-2">
            {renderStars(review.rating)}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(review)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-brown-400 hover:text-brown-600 hover:bg-brown-100 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-brown-400 hover:text-terracotta-500 hover:bg-terracotta-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-brown-700 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
            {review.content}
          </p>
          <p className="text-brown-300 text-xs">
            {formatDate(review.createdAt)}
            {review.updatedAt !== review.createdAt && ' (已编辑)'}
          </p>
        </div>
      ))}
    </div>
  );
}
