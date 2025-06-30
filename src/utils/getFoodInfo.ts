import axios from "axios";

export async function getFoodInfo(query: string) {
//   console.log('api query string: ', query);
  const res = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
    headers: {
        "X-Api-Key": import.meta.env.VITE_NUTRITION_API_KEY,
        "Content-Type": "application/json"
    }
  });

  const data = res.data.items;
  return data;
}