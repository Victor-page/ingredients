import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const url =
  'https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients.json';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const [{ loading, data, error }, sendRequest, clear] = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter !== inputRef.current.value) {
        return;
      }
      const query =
        enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${enteredFilter}"`;
      sendRequest(url + query, 'GET');
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, sendRequest, inputRef]);

  useEffect(() => {
    if (loading || error || !data) {
      return;
    }

    const loadedIngredients = [];
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const { title, amount } = data[key];
        loadedIngredients.push({ id: key, title, amount });
      }
    }
    onLoadIngredients(loadedIngredients);
  }, [data, loading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <p>Loading...</p>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
