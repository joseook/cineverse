export interface Movie {
  id: string;
  title: string;
  year: string;
  image: string;
  runtimeMins?: string;
  plot?: string;
  directors?: string[];
  stars?: string[];
  genres?: string[];
}

export interface MovieDetails extends Movie {
  releaseDate?: string;
  contentRating?: string;
  imDbRating?: string;
  metacriticRating?: string;
  tagline?: string;
  keywords?: string[];
  fullCast?: CastMember[];
  directors?: Director[];
  writers?: Writer[];
}

export interface CastMember {
  id: string;
  name: string;
  image?: string;
  character?: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface Writer {
  id: string;
  name: string;
}

export interface Rating {
  imDb?: string;
  metacritic?: string;
  rottenTomatoes?: string;
  filmAffinity?: string;
} 