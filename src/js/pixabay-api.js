// pixabay-api.js
import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "52578833-1380a7e48419fcc1cc100434d";
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    per_page: PER_PAGE,
    page,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}