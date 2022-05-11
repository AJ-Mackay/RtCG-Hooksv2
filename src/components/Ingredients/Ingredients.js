import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("You should not reach this step!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier } =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifier, error, isLoading]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      "https://react-hooks-update-7ccb3-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT"
    );
    // setIsLoading(true);
    // dispatchHttp({ type: "SEND" });
    // fetch(
    //   "https://react-hooks-update-7ccb3-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ ingredient }),
    //     headers: { "Content-Type": "application/json" },
    //   }
    // )
    //   .then((response) => {
    //     // setIsLoading(false);
    //     dispatchHttp({ type: "RESPONSE" });
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     // setUserIngredients((prevIngredients) => [
    //     //   ...prevIngredients,
    //     //   { id: responseData.name, ...ingredient },
    //     // ]);
    //     dispatch({
    //       type: "ADD",
    //       ingredient: { id: responseData.name, ...ingredient },
    //     });
    //   });
  }, []);

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      sendRequest(
        `https://react-hooks-update-7ccb3-default-rtdb.europe-west1.firebasedatabase.app/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {
    // dispatchHttp({ type: "CLEAR" });
    // setError(null);
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
