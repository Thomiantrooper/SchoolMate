import { useState, useEffect } from "react";
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortType, setSortType] = useState("title");

  const books = [
    { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", cover: "https://via.placeholder.com/150", description: "A deep dive into JavaScript's best features.", rating: 4, genre: "Programming" },
    { id: 2, title: "Eloquent JavaScript", author: "Marijn Haverbeke", cover: "https://via.placeholder.com/150", description: "An introduction to JavaScript and programming.", rating: 5, genre: "Programming" },
    { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", cover: "https://via.placeholder.com/150", description: "A series that explores the inner workings of JavaScript.", rating: 4, genre: "Programming" },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", cover: "https://via.placeholder.com/150", description: "A handbook of agile software craftsmanship.", rating: 5, genre: "Best Seller" },
    { id: 5, title: "The Pragmatic Programmer", author: "Andrew Hunt", cover: "https://via.placeholder.com/150", description: "Journey to mastery of programming.", rating: 5, genre: "Recommended" },
  ];

  const featuredBook = books[Math.floor(Math.random() * books.length)];

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "title") return a.title.localeCompare(b.title);
    if (sortType === "rating") return b.rating - a.rating;
    return 0;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFavorite = showFavoritesOnly ? favorites.includes(book.id) : true;
    return matchSearch && matchFavorite;
  });

  const openPopup = (book) => {
    setSelectedBook(book);
    setIsOpen(true);
  };

  const closePopup = () => setIsOpen(false);

  const toggleFavorite = (bookId) => {
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const toggleMusic = () => {
    setBackgroundMusic(!backgroundMusic);
  };

  const rateBook = (bookId, newRating) => {
    // Normally should update backend, but we'll just log it for now
    console.log(`Book ${bookId} rated with ${newRating} stars`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="relative p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-serif overflow-hidden">
      
      {/* Floating animated icons (background) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute bg-yellow-500 rounded-full w-2 h-2 animate-ping" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 4}s` }}></div>
        ))}
      </div>

      <h1 className="text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg text-center">📚 Nostalgic Library</h1>

      {/* Music button */}
      <div className="flex justify-center mb-4">
        <button onClick={toggleMusic} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full font-semibold shadow-md">
          {backgroundMusic ? "Pause Music 🎵" : "Play Nostalgic Music 🎶"}
        </button>
      </div>

      {/* Animated music notes if playing */}
      {backgroundMusic && (
        <div className="flex justify-center space-x-2 mb-6">
          <span className="animate-bounce text-yellow-300">🎶</span>
          <span className="animate-bounce text-yellow-300 delay-200">🎵</span>
          <span className="animate-bounce text-yellow-300 delay-400">🎶</span>
        </div>
      )}

      {/* Featured book */}
      <div className="max-w-2xl mx-auto p-6 mb-10 bg-gray-800 rounded-lg shadow-lg border-2 border-yellow-500 text-center">
        <h2 className="text-2xl font-bold mb-2 text-yellow-300">🌟 Featured Book</h2>
        <p className="italic text-gray-300">"{featuredBook.title}" by {featuredBook.author}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
        />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="p-2 rounded-lg bg-gray-700 text-white"
        >
          <option value="title">Sort by Title</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <button
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
          className="p-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg"
        >
          {showFavoritesOnly ? "Show All" : "Show Favorites ❤️"}
        </button>
      </div>

      {/* Books slider */}
      <div className="max-w-6xl mx-auto">
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
                <p className="text-yellow-400 relative z-10">{book.genre}</p>
                <div className="flex justify-center mt-1 relative z-10">
                  {[...Array(5)].map((_, idx) => (
                    <span
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        rateBook(book.id, idx + 1);
                      }}
                      className={`cursor-pointer text-xl ${idx < book.rating ? "text-yellow-300" : "text-gray-400"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
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

      {/* Book Popup */}
      {selectedBook && (
        <Dialog open={isOpen} onClose={closePopup} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-8 rounded-lg max-w-lg text-center shadow-xl border-2 border-yellow-500">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">{selectedBook.title}</h2>
            <p className="text-gray-400 mb-2">by {selectedBook.author}</p>
            <p className="text-yellow-300 mb-4 italic">Genre: {selectedBook.genre}</p>
            <p className="text-gray-300 mb-4">"{selectedBook.description}"</p>
            <p className="text-yellow-400">⭐ {selectedBook.rating} / 5</p>
            <button onClick={closePopup} className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-gray-900 font-semibold">
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Library;
