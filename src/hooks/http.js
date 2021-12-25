import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;

    default:
      throw new Error('Should not be reached!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, requestExtra, identifier) => {
      dispatchHttp({ type: 'SEND_REQUEST', identifier });

      fetch(url, {
        method,
        body,
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatchHttp({ type: 'RESPONSE', responseData, extra: requestExtra });
        })
        .catch((error) => {
          let errorMessage = null;
          if (identifier === 'REMOVE_INGREDIENT') {
            errorMessage = 'Removing the ingredient went wrong!';
          } else if (identifier === 'ADD_INGREDIENT') {
            errorMessage = 'Adding the ingredient went wrong!';
          } else {
            errorMessage = error.message;
          }
          dispatchHttp({ type: 'ERROR', errorMessage });
        });
    },
    []
  );

  return [httpState, sendRequest, clear];
};

export default useHttp;
