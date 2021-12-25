import React, {
  useReducer,
  useCallback,
  // useState
  useMemo,
  useEffect,
} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;

    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'REMOVE':
      return currentIngredients.filter(({ id }) => id !== action.id);

    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const [{ loading, data, error, extra, identifier }, sendRequest, clear] =
    useHttp();

  useEffect(() => {
    if (loading || error) {
      return;
    }

    if (identifier === 'REMOVE_INGREDIENT') {
      dispatchIngredients({ type: 'REMOVE', id: extra });
    } else if (identifier === 'ADD_INGREDIENT') {
      dispatchIngredients({
        type: 'ADD',
        ingredient: { id: data.name, ...extra },
      });
    }
  }, [data, extra, identifier, loading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients.json`,
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const ingredientList = useMemo(
    () => (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    ),
    [ingredients, removeIngredientHandler]
  );

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        loading={loading}
        onAddIngredient={addIngredientHandler}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
