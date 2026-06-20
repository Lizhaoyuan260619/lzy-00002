import { useState } from 'react';
import { Star, BookOpen, User, Tag, Calendar, MessageSquare, Plus, BookMarked, AlertTriangle } from 'lucide-react';
import type { Review, ReviewFormData, ReadingStatus } from '@/types';
import { READING_STATUS_LABELS } from '@/types';
import { formatDate } from '@/utils/storage';
import Modal from '@/components/Modal';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { useBookStore } from '@/store/useBookStore';

interface BookDetailModalProps {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
}

const statusIcons: Record<ReadingStatus, typeof BookOpen> = {
  unread: BookOpen,
  reading: BookOpen,
  completed: BookOpen
};

export default function BookDetailModal({ bookId, isOpen, onClose }: BookDetailModalProps) {
  const book = useBookStore((state) => state.getBookById(bookId));
  const { addReview, updateReview, deleteReview } = useBookStore();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  if (!book) return null;

  const handleAddReview = (data: ReviewFormData) => {
    addReview(book.id, data);
    setIsReviewFormOpen(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsReviewFormOpen(true);
  };

  const handleUpdateReview = (data: ReviewFormData) => {
    if (editingReview) {
      updateReview(book.id, editingReview.id, data);
      setEditingReview(null);
      setIsReviewFormOpen(false);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setDeletingReviewId(reviewId);
    setIsDeleteReviewModalOpen(true);
  };

  const confirmDeleteReview = () => {
    if (deletingReviewId) {
      deleteReview(book.id, deletingReviewId);
      setDeletingReviewId(null);
      setIsDeleteReviewModalOpen(false);
    }
  };

  const renderStars = (rating: number) => {
    if (rating === 0) return <span className="text-brown-300 text-sm">暂无评分</span>;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-terracotta-500 fill-terracotta-500' : 'text-brown-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const StatusIcon = statusIcons[book.readingStatus];

  const getCoverGradient = (title: string) => {
    const gradients = [
      'from-brown-400 to-brown-600',
      'from-forest-400 to-forest-600',
      'from-terracotta-400 to-terracotta-600',
      'from-brown-500 to-brown-700',
      'from-forest-500 to-forest-700',
      'from-terracotta-500 to-terracotta-700'
    ];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={book.title}>
        <div className="space-y-5">
          <div className="flex gap-4">
            <div
              className={`w-28 h-36 bg-gradient-to-br ${getCoverGradient(
                book.title
              )} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}
            >
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2">
                  <BookMarked className="w-8 h-8 text-white/60 mx-auto mb-1" />
                  <p className="text-white/80 text-[10px]">{book.category}</p>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg font-semibold text-brown-800 mb-2 line-clamp-2">
                {book.title}
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-brown-600">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brown-600">
                  <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{book.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brown-600">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{book.publishYear}年</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <StatusIcon className="w-3.5 h-3.5 flex-shrink-0 text-brown-500" />
                  <span className={`status-badge text-[10px] px-2 py-0.5 ${
                    book.readingStatus === 'unread'
                      ? 'status-unread'
                      : book.readingStatus === 'reading'
                      ? 'status-reading'
                      : 'status-completed'
                  }`}>
                    {READING_STATUS_LABELS[book.readingStatus]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-b border-brown-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-brown-500">个人评分</span>
              {renderStars(book.rating)}
            </div>
            {book.completedAt && (
              <span className="text-xs text-brown-400">
                {formatDate(book.completedAt)} 读完
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="flex items-center gap-2 font-serif font-semibold text-brown-800">
                <MessageSquare className="w-4 h-4" />
                书评
                <span className="text-sm font-normal text-brown-400">
                  ({book.reviews.length})
                </span>
              </h4>
              {!isReviewFormOpen && (
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setIsReviewFormOpen(true);
                  }}
                  className="flex items-center gap-1 text-sm text-brown-600 hover:text-brown-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  写书评
                </button>
              )}
            </div>

            {isReviewFormOpen && (
              <div className="mb-4 p-4 bg-white rounded-xl border border-brown-100">
                <ReviewForm
                  initialData={editingReview || undefined}
                  onSubmit={editingReview ? handleUpdateReview : handleAddReview}
                  onCancel={() => {
                    setIsReviewFormOpen(false);
                    setEditingReview(null);
                  }}
                />
              </div>
            )}

            <ReviewList
              reviews={book.reviews}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteReviewModalOpen}
        onClose={() => {
          setIsDeleteReviewModalOpen(false);
          setDeletingReviewId(null);
        }}
        title="确认删除"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-terracotta-500" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-brown-800 mb-2">
            确定要删除这条书评吗？
          </h3>
          <p className="text-brown-500 mb-6">删除后将无法恢复</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteReviewModalOpen(false);
                setDeletingReviewId(null);
              }}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button onClick={confirmDeleteReview} className="btn-danger flex-1">
              确认删除
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
