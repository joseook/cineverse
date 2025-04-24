import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  Share
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import Loading from '../components/Loading';
import { getMovieDetails, getMovieRating, getMovieCast, getMovieDirectors } from '../services/api';
import { MovieDetails, CastMember, Director } from '../utils/types';

type MovieDetailsRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

const { width, height } = Dimensions.get('window');

const MovieDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<MovieDetailsRouteProp>();
  const { movieId, movie } = route.params;

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullPlot, setShowFullPlot] = useState(false);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        // We already have the movie data from the navigation params
        if (movie) {
          // Make sure all required fields have fallback values
          const enhancedMovie: MovieDetails = {
            id: movie.id || movieId,
            title: movie.title || 'Unknown Title',
            year: movie.year || 'Unknown Year',
            image: movie.image && movie.image !== 'https://via.placeholder.com/300x450?text=No+Image'
              ? movie.image
              : 'https://m.media-amazon.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_.jpg', // Fallback to a default movie poster
            plot: movie.plot || 'No plot available for this title.',
            genres: movie.genres || ['Drama'],
            imDbRating: movie.imDbRating || '0',
            releaseDate: movie.releaseDate,
            runtimeMins: movie.runtimeMins || '120',
            contentRating: movie.contentRating || 'PG-13',
            directors: movie.directors || []
          };

          setMovieDetails(enhancedMovie);

          // Fetch additional cast data if not available
          if (!movie.fullCast) {
            // Create some mock cast members for demonstration
            const mockCast = [
              {
                id: '1',
                name: 'John Smith',
                image: 'https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_UX67_CR0,0,67,98_AL_.jpg',
                character: 'Main Character'
              },
              {
                id: '2',
                name: 'Emma Johnson',
                image: 'https://m.media-amazon.com/images/M/MV5BMTQzMjkwNTQ2OF5BMl5BanBnXkFtZTgwNTQ4MTQ4MTE@._V1_UY98_CR1,0,67,98_AL_.jpg',
                character: 'Supporting Character'
              },
              {
                id: '3',
                name: 'Michael Williams',
                image: 'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UY98_CR0,0,67,98_AL_.jpg',
                character: 'Villain'
              }
            ];
            setCast(mockCast);
          }
        } else {
          // Fetch all the movie details in a single API call
          const details = await getMovieDetails(movieId);

          // Format movie details
          const formattedDetails: MovieDetails = {
            id: details.id,
            title: details.primaryTitle || details.originalTitle,
            year: details.startYear?.toString() || 'Unknown',
            image: details.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
            plot: details.description,
            genres: details.genres || [],
            imDbRating: details.averageRating?.toString() || '',
            releaseDate: details.releaseDate,
            runtimeMins: details.runtimeMinutes?.toString(),
            contentRating: details.contentRating,
            directors: details.directors?.map((d: any) => ({ id: d.id, name: d.name })) || []
          };

          setMovieDetails(formattedDetails);
          setDirectors(formattedDetails.directors || []);

          // Use cast data if available in the details
          if (details.cast) {
            const topCast = details.cast.slice(0, 10).map((castMember: any) => ({
              id: castMember.id || String(Math.random()),
              name: castMember.name,
              image: castMember.image || 'https://via.placeholder.com/150x150?text=No+Image',
              character: castMember.character || ''
            }));
            setCast(topCast);
          }
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        // Use the movie data from navigation if API fails
        if (movie) {
          setMovieDetails({
            ...movie,
            image: movie.image || 'https://m.media-amazon.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_.jpg'
          } as MovieDetails);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, movie]);

  useEffect(() => {
    // Generate some mock similar movies
    const mockSimilarMovies: Movie[] = [
      {
        id: 'tt0468569',
        title: 'The Dark Knight',
        year: '2008',
        image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        genres: ['Action', 'Crime', 'Drama'],
        plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
      },
      {
        id: 'tt0816692',
        title: 'Interstellar',
        year: '2014',
        image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        genres: ['Adventure', 'Drama', 'Sci-Fi'],
        plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
      },
      {
        id: 'tt0133093',
        title: 'The Matrix',
        year: '1999',
        image: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        genres: ['Action', 'Sci-Fi'],
        plot: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
      }
    ];

    setSimilarMovies(mockSimilarMovies);
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would implement storing favorites in AsyncStorage or similar
  };

  const shareMovie = async () => {
    try {
      if (movieDetails) {
        await Share.share({
          message: `Check out ${movieDetails.title} (${movieDetails.year}) on CineVerse! It has a rating of ${movieDetails.imDbRating}/10.`,
          title: `CineVerse: ${movieDetails.title}`,
        });
      }
    } catch (error) {
      console.log('Error sharing movie:', error);
    }
  };

  const renderCastItem = ({ item }: { item: CastMember }) => (
    <View style={styles.castItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150x150?text=No+Image' }}
        style={styles.castImage}
      />
      <Text style={styles.castName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.characterName} numberOfLines={1}>{item.character}</Text>
    </View>
  );

  const renderPlot = () => {
    if (!movieDetails?.plot) return null;

    const plot = movieDetails.plot;
    const truncatedPlot = plot.length > 150 && !showFullPlot
      ? plot.substring(0, 150) + '...'
      : plot;

    return (
      <View>
        <Text style={styles.plot}>{truncatedPlot}</Text>
        {plot.length > 150 && (
          <TouchableOpacity
            onPress={() => setShowFullPlot(!showFullPlot)}
            style={styles.readMoreButton}
          >
            <Text style={styles.readMoreText}>
              {showFullPlot ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSimilarMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.similarMovieItem}
      onPress={() => navigation.push('MovieDetails', { movieId: item.id, movie: item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.similarMovieImage}
        resizeMode="cover"
      />
      <Text style={styles.similarMovieTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.similarMovieYear}>{item.year}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Loading movie details..." />;
  }

  if (!movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView}>
        {/* Backdrop and poster */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: movieDetails.image || 'https://via.placeholder.com/300x450?text=No+Image' }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['transparent', '#1F1D36']}
            style={styles.backdropGradient}
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={26}
                color={isFavorite ? "#E9A6A6" : "#fff"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareMovie}>
              <Ionicons name="share-social-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.posterAndInfo}>
            <Image
              source={{ uri: movieDetails.image || 'https://via.placeholder.com/300x450?text=No+Image' }}
              style={styles.poster}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{movieDetails.title}</Text>
              <Text style={styles.year}>{movieDetails.year}</Text>

              <View style={styles.statsRow}>
                {movieDetails.contentRating && (
                  <View style={styles.ratingPill}>
                    <Text style={styles.ratingText}>{movieDetails.contentRating}</Text>
                  </View>
                )}

                {movieDetails.runtimeMins && (
                  <View style={styles.runtimeContainer}>
                    <Ionicons name="time-outline" size={16} color="#bbb" />
                    <Text style={styles.runtimeText}>{movieDetails.runtimeMins} min</Text>
                  </View>
                )}
              </View>

              {movieDetails.imDbRating && (
                <View style={styles.scoreContainer}>
                  <Ionicons name="star" size={22} color="#FFC107" />
                  <Text style={styles.score}>{movieDetails.imDbRating}</Text>
                  <Text style={styles.scoreMax}>/10</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Movie info */}
        <View style={styles.infoContainer}>
          {/* Genres */}
          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <View style={styles.genreContainer}>
              {movieDetails.genres.map((genre, index) => (
                <View key={index} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Plot */}
          {movieDetails.plot && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              {renderPlot()}
            </View>
          )}

          {/* Directors */}
          {directors && directors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Director{directors.length > 1 ? 's' : ''}</Text>
              {directors.map((director, index) => (
                <Text key={index} style={styles.directorName}>{director.name}</Text>
              ))}
            </View>
          )}

          {/* Cast */}
          {cast && cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Cast</Text>
              <FlatList
                data={cast}
                renderItem={renderCastItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
              />
            </View>
          )}

          {/* Similar Movies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Movies</Text>
            <FlatList
              data={similarMovies}
              renderItem={renderSimilarMovieItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarMoviesContainer}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1D36',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: 450,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: 270,
    position: 'absolute',
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 270,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  posterAndInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3F3B6C',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingPill: {
    backgroundColor: '#3F3B6C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  runtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  runtimeText: {
    color: '#bbb',
    fontSize: 14,
    marginLeft: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  scoreMax: {
    color: '#bbb',
    fontSize: 14,
    marginLeft: 2,
  },
  infoContainer: {
    padding: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genrePill: {
    backgroundColor: '#3F3B6C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#E9A6A6',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  plot: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ddd',
  },
  readMoreButton: {
    marginTop: 6,
  },
  readMoreText: {
    color: '#E9A6A6',
    fontWeight: '600',
    fontSize: 14,
  },
  directorName: {
    fontSize: 15,
    color: '#ddd',
    marginBottom: 4,
  },
  castList: {
    paddingTop: 8,
  },
  castItem: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3F3B6C',
  },
  castName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
  characterName: {
    fontSize: 12,
    color: '#A5A5A5',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F1D36',
  },
  errorText: {
    fontSize: 16,
    color: '#E9A6A6',
  },
  similarMoviesContainer: {
    paddingVertical: 16,
  },
  similarMovieItem: {
    width: 150,
    marginRight: 16,
  },
  similarMovieImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarMovieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  similarMovieYear: {
    color: '#A5A5A5',
    fontSize: 12,
  },
});

export default MovieDetailsScreen; 