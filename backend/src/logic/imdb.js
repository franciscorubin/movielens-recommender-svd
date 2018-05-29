const imdb = require('imdb-api');
const omdb_api_key = '8ec0b727';

export function get_movies_data(imdb_ids) {
  if (!Array.isArray(imdb_ids)) {
    imdb_ids = [imdb_ids];
  }

  const promises = imdb_ids.map((id) => {
     return imdb.getById(`tt${id}`, {apiKey: omdb_api_key, timeout: 3000}).catch((err) => { console.log('Error getting info of imdb movie.'); }); 
  });
  return Promise.all(promises);
}