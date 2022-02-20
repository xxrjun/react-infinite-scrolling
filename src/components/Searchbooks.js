import { useEffect, useState } from "react";
import axios from "axios";
const Search = (query, pageNumber) => {
  const url = "http://openlibrary.org/search.json";
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    let cancel;
    setLoading(true);
    setError(false);
    axios
      .get(url, {
        params: {
          q: query,
          page: pageNumber,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        console.log(res);
        setBooks((prevBooks) => {
          return [
            ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
          ];
        });
        setLoading(false);
        setHasMore(res.data.docs.length > 0);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
        console.log(e);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, books, hasMore, error };
};

export default Search;
