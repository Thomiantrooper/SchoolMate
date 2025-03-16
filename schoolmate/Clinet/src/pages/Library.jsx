import { useState } from "react";
import { Dialog } from "@headlessui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const books = [
    { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", cover: "https://via.placeholder.com/150" },
    { id: 2, title: "Eloquent JavaScript", author: "Marijn Haverbeke", cover: "https://via.placeholder.com/150" },
    { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", cover: "https://via.placeholder.com/150" },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", cover: "https://via.placeholder.com/150" },
  ];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPopup = (book) => {
    setSelectedBook(book);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white text-center">
      <h1 className="text-4xl font-bold mb-8">📚 Professional Library</h1>
      <div className="max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
      <div className="max-w-5xl mx-auto">
        <Slider {...settings}>
          {filteredBooks.map((book) => (
            <div key={book.id} className="p-4">
              <div
                className="w-56 h-80 bg-gray-800 rounded-lg shadow-lg mx-auto cursor-pointer border-4 border-gray-700 hover:border-blue-500 transition-all flex flex-col items-center justify-center relative book-container transform hover:scale-105"
                onClick={() => openPopup(book)}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-700 to-transparent rounded-lg shadow-inner"></div>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h2 className="text-lg mt-2 px-2 text-white font-semibold relative z-10">{book.title}</h2>
                <p className="text-gray-400 text-sm px-2 relative z-10">{book.author}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {selectedBook && (
        <Dialog open={isOpen} onClose={closePopup} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-lg text-center book-popup shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{selectedBook.title}</h2>
            <p className="text-gray-400 mb-4">by {selectedBook.author}</p>
            <p className="text-gray-300">This is where the book content would be displayed.</p>
            <button onClick={closePopup} className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg">Close</button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Library;