import { useState, useCallback, useRef } from "react";
import searchBooks from "../components/Searchbooks";

const Searchpage = () => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const searchHandler = (e) => {
    console.log(e.target.value);
    setQuery(e.target.value);
    setPageNumber(1);
  };

  const { books, loading, error, hasMore } = searchBooks(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <input type="text" onChange={searchHandler} />
      {books.map((book, index) => {
        if (book.length == index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
};

export default Searchpage;
