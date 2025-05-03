import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaHeart, FaRegHeart, FaStar, FaMusic, FaVolumeMute, FaSearch, FaFilter, FaBookOpen } from "react-icons/fa";

const Library = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortType, setSortType] = useState("title");
  const [isLoading, setIsLoading] = useState(true);

  const books = [
    {
      id: 1,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      cover: "/js.png",
      description: "A deep dive into JavaScript's best features that will change how you write code forever. This book reveals both the elegance and the quirks of JavaScript.",
      rating: 4,
      genre: "Programming",
      link: "https://andersonguelphjs.github.io/OReilly_JavaScript_The_Good_Parts_May_2008.pdf",
      pages: 176,
      year: 2008
    },
    {
      id: 2,
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      cover: "/eloquent.jpg",
      description: "An introduction to JavaScript and programming that will take you from beginner to confident practitioner. Full of practical examples and exercises.",
      rating: 5,
      genre: "Programming",
      link: "https://eloquentjavascript.net/Eloquent_JavaScript_small.pdf",
      pages: 472,
      year: 2018
    },
    {
      id: 3,
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      cover: "/you_dont_know.jpg",
      description: "A series that explores the inner workings of JavaScript. Goes deep into the core mechanisms of the language.",
      rating: 4,
      genre: "Programming",
      link: "https://archive.org/details/kyle-simpson-all-6",
      pages: 294,
      year: 2015
    },
    {
      id: 4,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover: "/clean_code.jpg",
      description: "A handbook of agile software craftsmanship that will teach you how to write code that is maintainable, efficient, and elegant.",
      rating: 5,
      genre: "Best Seller",
      link: "https://github.com/jnguyen095/clean-code/blob/master/Clean.Code.A.Handbook.of.Agile.Software.Craftsmanship.pdf",
      pages: 464,
      year: 2008
    },
    {
      id: 5,
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      cover: "/programmer.jpg",
      description: "Your journey to mastery of programming. Filled with practical advice and timeless wisdom for software developers.",
      rating: 5,
      genre: "Recommended",
      link: "https://github.com/lighthousand/books/blob/master/the-pragmatic-programmer.pdf",
      pages: 352,
      year: 1999
    },
    
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const featuredBook = books[Math.floor(Math.random() * books.length)];

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "title") return a.title.localeCompare(b.title);
    if (sortType === "rating") return b.rating - a.rating;
    if (sortType === "year") return b.year - a.year;
    return 0;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase());
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

  const toggleMusic = () => setBackgroundMusic(!backgroundMusic);

  const rateBook = (bookId, newRating) => {
    console.log(`Book ${bookId} rated with ${newRating} stars`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: Math.min(3, filteredBooks.length),
    slidesToScroll: 1,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredBooks.length),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-yellow-400 rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
        ))}
      </div>

      {/* Floating books decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              rotate: `${-30 + Math.random() * 60}deg`,
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            📘
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Nostalgic Library
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover timeless programming books that shaped the industry
          </p>
        </motion.header>

        {/* Music toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={toggleMusic}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all duration-300 ${
              backgroundMusic
                ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {backgroundMusic ? (
              <>
                <FaVolumeMute /> Pause Music
              </>
            ) : (
              <>
                <FaMusic /> Play Nostalgic Music
              </>
            )}
          </button>
        </motion.div>

        {backgroundMusic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center space-x-3 mb-8"
          >
            {["🎶", "🎵", "🎷", "🎸", "🎹"].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Featured book */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto p-6 mb-12 bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-30"></div>
          <h2 className="text-2xl font-bold mb-2 text-yellow-400 flex items-center justify-center gap-2">
            <FaStar className="text-yellow-300" /> Featured Book
          </h2>
          <p className="text-xl italic text-gray-300 mb-1">
            "{featuredBook.title}" by {featuredBook.author}
          </p>
          <p className="text-gray-400">{featuredBook.genre} • {featuredBook.year} • {featuredBook.pages} pages</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700/80 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-gray-700/80 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="year">Sort by Year</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
                showFavoritesOnly
                  ? "bg-red-500/90 hover:bg-red-600 text-white"
                  : "bg-gray-700/80 hover:bg-gray-600 text-white"
              }`}
            >
              {showFavoritesOnly ? (
                <>
                  <FaHeart /> Favorites
                </>
              ) : (
                <>
                  <FaRegHeart /> Show Favorites
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center h-64"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-4xl text-yellow-400"
              >
                📚
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book carousel */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-7xl mx-auto mb-16"
          >
            {filteredBooks.length > 0 ? (
              <Slider {...settings}>
                {filteredBooks.map((book) => (
                  <div key={book.id} className="px-4 py-2">
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="relative h-full"
                    >
                      <div
                        className="h-96 bg-gray-800 rounded-xl shadow-lg mx-auto cursor-pointer border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-300 flex flex-col overflow-hidden group"
                        onClick={() => openPopup(book)}
                      >
                        {/* Book cover */}
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        
                        {/* Book info */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h2 className="text-lg font-bold text-yellow-300 mb-1 line-clamp-1">{book.title}</h2>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-1">{book.author}</p>
                          <p className="text-yellow-400/80 text-xs mb-3">{book.genre}</p>
                          
                          {/* Rating */}
                          <div className="flex justify-center mb-3">
                            {[...Array(5)].map((_, idx) => (
                              <span
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  rateBook(book.id, idx + 1);
                                }}
                                className={`cursor-pointer text-lg ${idx < book.rating ? "text-yellow-300" : "text-gray-600"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          
                          {/* Read link */}
                          <div className="mt-auto">
                            <a
                              href={book.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block w-full text-center px-3 py-2 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                            >
                              <FaBookOpen className="inline mr-2" /> Read Now
                            </a>
                          </div>
                        </div>
                        
                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(book.id);
                          }}
                          className={`absolute top-3 right-3 text-2xl p-2 rounded-full backdrop-blur-sm transition-all ${
                            favorites.includes(book.id)
                              ? "text-red-500 bg-black/30 hover:bg-black/40"
                              : "text-gray-400 bg-black/20 hover:bg-black/30 hover:text-red-400"
                          }`}
                        >
                          {favorites.includes(book.id) ? <FaHeart /> : <FaRegHeart />}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-block p-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white mb-6">
                  <FaBookOpen size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Books Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {showFavoritesOnly
                    ? "You haven't favorited any books yet. Click the heart icon to add some!"
                    : "Try adjusting your search or filters"}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Book details modal */}
        <AnimatePresence>
          {selectedBook && (
            <Dialog
              open={isOpen}
              onClose={closePopup}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={closePopup}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-gray-800 rounded-xl max-w-2xl w-full mx-auto p-8 shadow-2xl border border-yellow-500/30 overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full filter blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-tr-full filter blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-yellow-400 mb-1">{selectedBook.title}</h2>
                      <p className="text-gray-400 text-lg">by {selectedBook.author}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(selectedBook.id);
                      }}
                      className={`text-3xl p-2 ${
                        favorites.includes(selectedBook.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"
                      }`}
                    >
                      {favorites.includes(selectedBook.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      {selectedBook.genre}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {selectedBook.pages} pages
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      Published: {selectedBook.year}
                    </span>
                  </div>

                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <span
                        key={idx}
                        onClick={() => rateBook(selectedBook.id, idx + 1)}
                        className={`cursor-pointer text-2xl mr-1 ${idx < selectedBook.rating ? "text-yellow-400" : "text-gray-600"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-400">{selectedBook.rating}/5</span>
                  </div>

                  <p className="text-gray-300 mb-8 leading-relaxed">{selectedBook.description}</p>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <motion.a
                      href={selectedBook.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 transition-all"
                    >
                      <FaBookOpen /> Read Online
                    </motion.a>
                    <motion.button
                      onClick={closePopup}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition-all"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Library;