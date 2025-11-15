import { GoogleGenAI, Type } from "@google/genai";
import { Category, GroceryItem, Recipe, NormalizedGroceryItem } from "../types";

export interface RecipeRequest {
  ingredients: string[];
  time: string;
  method: string;
  diet: string;
  calories: string;
  protein: string;
  strictness: 'loose' | 'strict';
}

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY is not set. Recipe generation will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateRecipe = async (request: RecipeRequest): Promise<Omit<Recipe, 'id'>> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please set up your API key to use this feature.");
  }
  
  const { ingredients, time, method, diet, calories, protein, strictness } = request;

  const ingredient_instructions = strictness === 'strict'
    ? `You **must only** use the provided ingredients. You can supplement with a few common pantry staples if necessary (like oil, salt, pepper, spices). Do not suggest buying any other primary ingredients.`
    : `You can supplement with a few common pantry staples if necessary (like oil, salt, pepper, spices). You may also suggest 1-2 additional ingredients that would complement the dish, marking them clearly in the ingredients list as "(optional purchase)".`

  const prompt = `
    You are a creative and helpful chef. Generate a recipe based on the following criteria and return it as a JSON object.

    **Ingredients to use:** ${ingredients.join(', ')}
    ${ingredient_instructions}

    **Constraints:**
    - **Cooking Time:** Approximately ${time} minutes.
    - **Cooking Method:** Primarily using ${method}.
    - **Dietary Preference:** ${diet}.
    - **Calorie Goal:** ${calories}.
    - **Protein Goal:** ${protein}.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  name: { type: Type.STRING, description: "A creative and appealing name for the dish." },
                  description: { type: Type.STRING, description: "A brief, enticing summary of the dish." },
                  ingredients: { 
                      type: Type.ARRAY,
                      items: {
                          type: Type.OBJECT,
                          properties: {
                              name: { type: Type.STRING, description: "The full ingredient line, including quantity (e.g., '2 cups flour')." },
                              normalizedName: { type: Type.STRING, description: "The simple, base name of the ingredient for searching (e.g., 'flour')." }
                          },
                          required: ['name', 'normalizedName']
                      },
                      description: "A list of all ingredients required for the recipe."
                  },
                  instructions: { type: Type.STRING, description: "Step-by-step cooking instructions, formatted as a single Markdown string." }
              },
              required: ['name', 'description', 'ingredients', 'instructions']
          }
      }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Sorry, I had trouble coming up with a recipe. Please check your setup or try again later.');
  }
};


export const generateShoppingListFromRecipe = async (recipeText: string, servings: number): Promise<NormalizedGroceryItem[]> => {
    if (!API_KEY) {
        console.error("API key is not configured.");
        return [];
    }
    
    const prompt = `
        Parse the following recipe text for ${servings} people. Extract all ingredients and their quantities, adjusting them for the specified number of servings. 
        For each ingredient, determine its most appropriate category from the list: ${Object.values(Category).join(', ')}.
        Also provide a simple, normalized name for each ingredient (e.g., for "2 tbsp chopped parsley", the normalized name would be "parsley").
        Return a JSON array of objects.
        
        Recipe:
        ---
        ${recipeText}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: "The name of the ingredient, including quantity and preparation (e.g., '1 cup flour, sifted').",
                            },
                            category: {
                                type: Type.STRING,
                                enum: Object.values(Category),
                                description: "The grocery category for the ingredient.",
                            },
                            normalizedName: {
                                type: Type.STRING,
                                description: "The simple, base name of the ingredient for searching (e.g., 'flour')."
                            }
                        },
                        required: ['name', 'category', 'normalizedName'],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as NormalizedGroceryItem[];

    } catch (error) {
        console.error('Error generating shopping list from recipe:', error);
        throw new Error('Failed to parse the recipe. Please check the format or try again.');
    }
};
