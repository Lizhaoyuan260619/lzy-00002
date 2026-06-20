import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import BookList from '@/pages/BookList';
import Statistics from '@/pages/Statistics';
import Modal from '@/components/Modal';
import BookForm from '@/components/BookForm';
import { useBookStore } from '@/store/useBookStore';
import type { BookFormData } from '@/types';

export default function App() {
  const { init, isInitialized, addBook } = useBookStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  const handleAddBook = (data: BookFormData) => {
    addBook(data);
    setIsAddModalOpen(false);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-brown-600 font-serif text-xl">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header onAddBook={() => setIsAddModalOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BookList onOpenAddModal={() => setIsAddModalOpen(true)} />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加新图书"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </Router>
  );
}
