import React, { useEffect, useState } from 'react';
import './TableComponent.css';



const RecipeApp = () => {
  const [recipes, setRecipes] = useState([]);
  const [editedRecipes, setEditedRecipes] = useState([]);
  const [originalRecipes, setOriginalRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes'));
    if (savedRecipes) {
      setEditedRecipes(savedRecipes);
    }
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        'https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json'
      );
      const data = await response.json();

      // Sort the recipes by Price and Name
      const sortedData = data.sort((a, b) => {
        if (parseFloat(a.price) === parseFloat(b.price)) {
          return a.name.localeCompare(b.name);
        }
        return parseFloat(a.price) - parseFloat(b.price);
      });

      setRecipes(sortedData);
      setOriginalRecipes(sortedData);
      setEditedRecipes(sortedData.map(recipe => ({ ...recipe })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePriceChange = (recipeId, newPrice) => {
    const updatedRecipes = editedRecipes.map(recipe => {
      if (recipe.id === recipeId) {
        recipe.price = newPrice;
      }
      return recipe;
    });

    setEditedRecipes(updatedRecipes);
  };

  const handleSave = () => {
    localStorage.setItem('recipes', JSON.stringify(editedRecipes));
  };

  const handleReset = () => {
    setEditedRecipes(originalRecipes.map(recipe => ({ ...recipe })));
  };

  return (
    <div className="container">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {editedRecipes.map(recipe => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>
                  <input
                    type="text"
                    className="price-input"
                    value={recipe.price}
                    onChange={e =>
                      handlePriceChange(recipe.id, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default RecipeApp;
