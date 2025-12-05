
// - запит

import axios from "axios";



export async function getImagesByQuery(query, page) {
  const params = {
    q: query,
    key: '52578833-1380a7e48419fcc1cc100434d',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  };

  const response = await axios.get('https://pixabay.com/api/', { params })

  return {
    hits: response.data.hits,
    totalHits: response.data.totalHits,
  }
}
