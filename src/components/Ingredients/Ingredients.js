import React, {
  useReducer,
  useCallback,
  // useState
} from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...httpState, error: null };

    default:
      throw new Error('Should not be reached!');
  }
};

const Ingredients = () => {
  const [ingredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setIngredients(filteredIngredients);
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND_REQUEST' });
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
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id, ...ingredient },
        // ]);
        dispatchIngredients({ type: 'ADD', ingredient: { id, ...ingredient } });
        dispatchHttp({ type: 'RESPONSE' });
      })
      .catch(() =>
        dispatchHttp({
          type: 'ERROR',
          errorMessage: 'Adding the ingredient went wrong!',
        })
      );
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND_REQUEST' });
    fetch(
      `https://react-http-7aca5-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      { method: 'DELETE' }
    )
      .then(() => {
        // setIngredients((prevIngredients) =>
        //   prevIngredients.filter((prevIngredient) => prevIngredient.id !== id)
        // );
        dispatchIngredients({ type: 'REMOVE', id });
        dispatchHttp({ type: 'RESPONSE' });
      })
      .catch(() =>
        dispatchHttp({
          type: 'ERROR',
          errorMessage: 'Removing the ingredient went wrong!',
        })
      );
  }, []);

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: 'CLEAR' });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        loading={httpState.loading}
        onAddIngredient={addIngredientHandler}
      />

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
