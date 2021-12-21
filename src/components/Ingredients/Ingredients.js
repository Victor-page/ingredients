import React, { useState, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => setIngredients(filteredIngredients),
    []
  );

  const addIngredientHandler = (ingredient) => {
    fetch(
      'https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => response.json())
      .then(({ name: id }) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id, ...ingredient },
        ]);
      })
      .catch(console.log);
  };

  const removeIngredientHandler = (id) => {
    fetch(
      `https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      { method: 'DELETE' }
    )
      .then(() =>
        setIngredients((prevIngredients) =>
          prevIngredients.filter((prevIngredient) => prevIngredient.id !== id)
        )
      )
      .catch(console.log);
  };

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
