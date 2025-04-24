import axios from 'axios';

const API_KEY = 'b977322956mshc8076c0960a23c3p1dd51ajsncfd4400063d3';
const API_HOST = 'imdb236.p.rapidapi.com';

const apiClient = axios.create({
  baseURL: 'https://imdb236.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
});

export const getLowestRatedMovies = async () => {
  try {
    const response = await apiClient.get('/imdb/lowest-rated-movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching lowest rated movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/imdb/movie/details`, {
      params: { id: movieId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error);
    throw error;
  }
};

export const getMovieRating = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/imdb/movie/details`, {
      params: { id: movieId },
    });
    return response.data.averageRating;
  } catch (error) {
    console.error(`Error fetching movie rating for ${movieId}:`, error);
    throw error;
  }
};

export const getMovieDirectors = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/imdb/movie/details`, {
      params: { id: movieId },
    });
    return response.data.directors || [];
  } catch (error) {
    console.error(`Error fetching movie directors for ${movieId}:`, error);
    throw error;
  }
};

export const getMovieWriters = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/imdb/movie/details`, {
      params: { id: movieId },
    });
    return response.data.writers || [];
  } catch (error) {
    console.error(`Error fetching movie writers for ${movieId}:`, error);
    throw error;
  }
};

export const getMovieCast = async (movieId: string) => {
  try {
    const response = await apiClient.get(`/imdb/movie/details`, {
      params: { id: movieId },
    });
    return response.data.cast || [];
  } catch (error) {
    console.error(`Error fetching movie cast for ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await apiClient.get(`/imdb/search`, {
      params: { query },
    });
    return response.data.results || [];
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error);
    throw error;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await apiClient.get('/imdb/lowest-rated-movies');
    // Using lowest-rated in reverse as a mock for top-rated
    return response.data.reverse();
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genre: string) => {
  try {
    // For now, this is a mock function that reuses existing data
    // In a real app, you would call a specific genre API endpoint
    const allMovies = await getTopRatedMovies();

    // Filter movies by genre (case insensitive)
    // In this mock, we'll simulate genre filtering by assigning random genres
    const genreMovies = allMovies.map(movie => ({
      ...movie,
      genres: [...(movie.genres || []),
      ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'][Math.floor(Math.random() * 5)]
      ]
    })).filter(movie =>
      movie.genres && movie.genres.some(g =>
        g.toLowerCase() === genre.toLowerCase()
      )
    );

    return genreMovies.length > 0 ? genreMovies : allMovies.slice(0, 10);
  } catch (error) {
    console.error(`Error fetching movies for genre ${genre}:`, error);
    throw error;
  }
}; 