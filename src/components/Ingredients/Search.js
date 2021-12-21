import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import './Search.css';

const url =
  'https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients.json';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter !== inputRef.current.value) {
        return;
      }
      const query =
        enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${enteredFilter}"`;
      fetch(url + query)
        .then((response) => response.json())
        .then((responseData) => {
          const loadedIngredients = [];
          for (const key in responseData) {
            if (Object.hasOwnProperty.call(responseData, key)) {
              const { title, amount } = responseData[key];
              loadedIngredients.push({ id: key, title, amount });
            }
          }
          onLoadIngredients(loadedIngredients);
        })
        .catch(console.log);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
