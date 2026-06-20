import { useState, useMemo } from 'react';
import { BookOpen, AlertTriangle, Plus, Search } from 'lucide-react';
import type { Book, ReadingStatus, BookFormData } from '@/types';
import { useBookStore } from '@/store/useBookStore';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import Modal from '@/components/Modal';
import BookForm from '@/components/BookForm';

interface BookListProps {
  onOpenAddModal: () => void;
}

export default function BookList({ onOpenAddModal }: BookListProps) {
  const { books, getFilteredBooks, updateBook, deleteBook, getBookById } = useBookStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus | ''>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<{ id: string; title: string } | null>(null);

  const filteredBooks = useMemo(
    () => getFilteredBooks(searchQuery, selectedCategory || undefined, selectedStatus || undefined),
    [books, searchQuery, selectedCategory, selectedStatus, getFilteredBooks]
  );

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeletingBook({ id, title });
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = (id: string, status: ReadingStatus) => {
    updateBook(id, { readingStatus: status });
  };

  const confirmDelete = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id);
      setIsDeleteModalOpen(false);
      setDeletingBook(null);
    }
  };

  const handleEditSubmit = (data: BookFormData) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
      setIsEditModalOpen(false);
      setEditingBook(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 animate-fade-in">
          <h2 className="font-serif text-2xl font-bold text-brown-800 mb-2">
            我的藏书
          </h2>
          <p className="text-brown-500">管理你的个人图书，追踪阅读进度</p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          totalBooks={books.length}
          filteredBooks={filteredBooks.length}
        />

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center mb-4">
              {searchQuery || selectedCategory || selectedStatus ? (
                <Search className="w-10 h-10 text-brown-400" />
              ) : (
                <BookOpen className="w-10 h-10 text-brown-400" />
              )}
            </div>
            <h3 className="font-serif text-xl font-semibold text-brown-700 mb-2">
              {searchQuery || selectedCategory || selectedStatus
                ? '没有找到匹配的图书'
                : '还没有添加任何图书'}
            </h3>
            <p className="text-brown-500 mb-6 text-center max-w-md">
              {searchQuery || selectedCategory || selectedStatus
                ? '试试调整搜索条件或清除筛选'
                : '点击右上角的"添加图书"按钮开始构建你的私人书架'}
            </p>
            {!(searchQuery || selectedCategory || selectedStatus) && (
              <button onClick={onOpenAddModal} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加第一本图书
              </button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBook(null);
        }}
        title="编辑图书"
      >
        {editingBook && (
          <BookForm
            initialData={editingBook}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingBook(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBook(null);
        }}
        title="确认删除"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-terracotta-500" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-brown-800 mb-2">
            确定要删除这本书吗？
          </h3>
          <p className="text-brown-500 mb-6">
            你将无法恢复 <span className="font-medium text-brown-700">"{deletingBook?.title}"</span> 的记录
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingBook(null);
              }}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button onClick={confirmDelete} className="btn-danger flex-1">
              确认删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
