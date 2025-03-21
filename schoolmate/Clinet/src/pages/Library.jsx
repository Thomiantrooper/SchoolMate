import { useState } from "react";
import { Dialog } from "@headlessui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState(false);

  const books = [
    { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", cover: "https://via.placeholder.com/150", description: "A deep dive into JavaScript's best features.", rating: 4 },
    { id: 2, title: "Eloquent JavaScript", author: "Marijn Haverbeke", cover: "https://via.placeholder.com/150", description: "An introduction to JavaScript and programming.", rating: 5 },
    { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", cover: "https://via.placeholder.com/150", description: "A series that explores the inner workings of JavaScript.", rating: 4 },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", cover: "https://via.placeholder.com/150", description: "A handbook of agile software craftsmanship.", rating: 5 },
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

  const toggleFavorite = (bookId) => {
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const toggleMusic = () => {
    setBackgroundMusic(!backgroundMusic);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white text-center font-serif">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">📚 Nostalgic Library</h1>
      <button onClick={toggleMusic} className="mb-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-semibold">
        {backgroundMusic ? "Pause Music 🎵" : "Play Nostalgic Music 🎶"}
      </button>
      <div className="max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
        />
      </div>
      <div className="max-w-5xl mx-auto">
        <Slider {...settings}>
          {filteredBooks.map((book) => (
            <div key={book.id} className="p-4">
              <div
                className="w-56 h-80 bg-gray-800 rounded-lg shadow-lg mx-auto cursor-pointer border-4 border-yellow-500 hover:border-yellow-300 transition-all flex flex-col items-center justify-center relative transform hover:scale-105 overflow-hidden"
                onClick={() => openPopup(book)}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-700 via-transparent to-black opacity-75 rounded-lg"></div>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg border-b-4 border-yellow-500"
                />
                <h2 className="text-lg mt-2 px-2 text-yellow-300 font-semibold relative z-10">{book.title}</h2>
                <p className="text-gray-400 text-sm px-2 relative z-10">{book.author}</p>
                <p className="text-yellow-400 relative z-10">⭐ {book.rating}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book.id);
                  }}
                  className={`absolute top-2 right-2 text-lg ${favorites.includes(book.id) ? "text-red-500" : "text-gray-400"}`}
                >
                  {favorites.includes(book.id) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {selectedBook && (
        <Dialog open={isOpen} onClose={closePopup} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-8 rounded-lg max-w-lg text-center shadow-xl border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">{selectedBook.title}</h2>
            <p className="text-gray-400 mb-4">by {selectedBook.author}</p>
            <p className="text-gray-300 italic">"{selectedBook.description}"</p>
            <button onClick={closePopup} className="mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-gray-900 font-semibold">Close</button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Library;
