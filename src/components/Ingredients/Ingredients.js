import React, { useState, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const url =
  'https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients.json';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => setIngredients(filteredIngredients),
    []
  );

  const addIngredientHandler = (ingredient) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then(({ name: id }) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id, ...ingredient },
        ]);
      })
      .catch(console.log);
  };

  const removeIngredientHandler = (id) =>
    setIngredients((prevIngredients) =>
      prevIngredients.filter((prevIngredient) => prevIngredient.id !== id)
    );

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
