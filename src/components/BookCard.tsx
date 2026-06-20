import { useState } from 'react';
import { Edit2, Trash2, Star, BookOpen, Clock, CheckCircle, BookMarked, MoreVertical } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { READING_STATUS_LABELS } from '@/types';
import { formatDate } from '@/utils/storage';

interface BookCardProps {
  book: Book;
  index: number;
  onEdit: (book: Book) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, status: ReadingStatus) => void;
}

const statusIcons: Record<ReadingStatus, typeof BookOpen> = {
  unread: Clock,
  reading: BookOpen,
  completed: CheckCircle
};

export default function BookCard({
  book,
  index,
  onEdit,
  onDelete,
  onStatusChange
}: BookCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const StatusIcon = statusIcons[book.readingStatus];

  const renderStars = (rating: number) => {
    if (rating === 0) return null;
    return (
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
  };

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
    <div
      className="card group animate-fade-in-up relative"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="relative">
        <div
          className={`h-40 bg-gradient-to-br ${getCoverGradient(
            book.title
          )} rounded-t-2xl flex items-center justify-center overflow-hidden`}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <BookMarked className="w-12 h-12 text-white/60 mx-auto mb-2" />
              <p className="text-white/80 text-xs font-medium">
                {book.category}
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <span
            className={`status-badge ${
              book.readingStatus === 'unread'
                ? 'status-unread'
                : book.readingStatus === 'reading'
                ? 'status-reading'
                : 'status-completed'
            }`}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {READING_STATUS_LABELS[book.readingStatus]}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 hover:bg-white text-brown-600 hover:text-brown-800 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute top-12 right-3 z-20 bg-white rounded-xl shadow-soft-hover border border-brown-100 py-1 min-w-[120px] animate-scale-in">
                <button
                  onClick={() => {
                    onEdit(book);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-brown-700 hover:bg-brown-50 flex items-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => {
                    setShowStatusMenu(!showStatusMenu);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-brown-700 hover:bg-brown-50 flex items-center gap-2 transition-colors justify-between"
                >
                  <span className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4" />
                    切换状态
                  </span>
                </button>
                {showStatusMenu && (
                  <div className="border-t border-brown-100 py-1">
                    {(['unread', 'reading', 'completed'] as ReadingStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => {
                            onStatusChange(book.id, status);
                            setShowMenu(false);
                            setShowStatusMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                            book.readingStatus === status
                              ? 'bg-brown-100 text-brown-800'
                              : 'text-brown-600 hover:bg-brown-50'
                          }`}
                        >
                          {(() => {
                            const Icon = statusIcons[status];
                            return <Icon className="w-4 h-4" />;
                          })()}
                          {READING_STATUS_LABELS[status]}
                        </button>
                      )
                    )}
                  </div>
                )}
                <div className="border-t border-brown-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      onDelete(book.id, book.title);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-terracotta-600 hover:bg-terracotta-50 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-serif text-lg font-semibold text-brown-800 mb-1 line-clamp-1"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-sm text-brown-500 mb-2">{book.author}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-brown-400 bg-brown-50 px-2 py-1 rounded-lg">
            {book.category}
          </span>
          <span className="text-xs text-brown-400">{book.publishYear}年</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brown-100">
          {renderStars(book.rating)}
          {book.completedAt && (
            <span className="text-xs text-brown-400">
              {formatDate(book.completedAt)} 读完
            </span>
          )}
          {!book.completedAt && book.rating === 0 && (
            <span className="text-xs text-brown-300">暂无评分</span>
          )}
        </div>
      </div>
    </div>
  );
}
