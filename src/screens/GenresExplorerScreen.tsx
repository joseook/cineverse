import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getLowestRatedMovies } from '../services/api';
import { Movie } from '../utils/types';

type GenresExplorerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenresExplorer'>;

// Complete list of genres (expanded)
const GENRES = [
  { id: 'action', name: 'Action', icon: 'flame-outline', color: '#FF5733' },
  { id: 'comedy', name: 'Comedy', icon: 'happy-outline', color: '#FFC300' },
  { id: 'drama', name: 'Drama', icon: 'Theater-masks' as any, color: '#C70039' },
  { id: 'horror', name: 'Horror', icon: 'skull-outline', color: '#581845' },
  { id: 'scifi', name: 'Sci-Fi', icon: 'planet-outline', color: '#0074D9' },
  { id: 'romance', name: 'Romance', icon: 'heart-outline', color: '#FF1493' },
  { id: 'thriller', name: 'Thriller', icon: 'flash-outline', color: '#444444' },
  { id: 'fantasy', name: 'Fantasy', icon: 'sparkles-outline', color: '#7D3C98' },
  { id: 'animation', name: 'Animation', icon: 'videocam-outline', color: '#3498DB' },
  { id: 'documentary', name: 'Documentary', icon: 'film-outline', color: '#16A085' },
  { id: 'adventure', name: 'Adventure', icon: 'compass-outline', color: '#27AE60' },
  { id: 'crime', name: 'Crime', icon: 'scan-outline', color: '#2C3E50' },
];

const GenresExplorerScreen = () => {
  const navigation = useNavigation<GenresExplorerScreenNavigationProp>();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedGenre && allMovies.length > 0) {
      filterMoviesByGenre(selectedGenre);
    } else {
      setFilteredMovies([]);
    }
  }, [selectedGenre, allMovies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const lowestRated = await getLowestRatedMovies();

      const formattedMovies = lowestRated.map((movie: any) => ({
        id: movie.id,
        title: movie.primaryTitle || movie.originalTitle,
        year: movie.startYear?.toString() || 'Unknown',
        image: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        imDbRating: movie.averageRating?.toString() || '',
        plot: movie.description,
        genres: movie.genres || [],
      }));

      setAllMovies(formattedMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMoviesByGenre = (genre: string) => {
    const genreName = GENRES.find(g => g.id === genre)?.name || '';
    const filtered = allMovies.filter(movie =>
      movie.genres && movie.genres.some(g =>
        g.toLowerCase() === genreName.toLowerCase()
      )
    );
    setFilteredMovies(filtered);
  };

  const handleGenrePress = (genreId: string) => {
    setSelectedGenre(genreId);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', {
      movieId: movie.id,
      movie: movie,
    });
  };

  const renderGenreItem = ({ item }: { item: typeof GENRES[0] }) => (
    <TouchableOpacity
      style={[
        styles.genreCard,
        selectedGenre === item.id && styles.genreCardSelected,
        { borderColor: item.color }
      ]}
      onPress={() => handleGenrePress(item.id)}
    >
      <View style={[styles.genreIconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.genreName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/300x450?text=No+Image' }}
          style={styles.movieImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        {item.imDbRating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.rating}>{item.imDbRating}</Text>
          </View>
        )}
      </View>
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyGenreResults = () => {
    if (!selectedGenre) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="film-outline" size={64} color="#3F3B6C" />
          <Text style={styles.emptyStateTitle}>Choose a Genre</Text>
          <Text style={styles.emptyStateText}>
            Select a genre from above to see related movies
          </Text>
        </View>
      );
    }

    const selectedGenreName = GENRES.find(g => g.id === selectedGenre)?.name || '';

    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#3F3B6C" />
        <Text style={styles.emptyStateTitle}>No Movies Found</Text>
        <Text style={styles.emptyStateText}>
          No movies in the {selectedGenreName} genre were found
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Genres</Text>
      </View>

      <FlatList
        data={GENRES}
        renderItem={renderGenreItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreList}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E9A6A6" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.movieList}
          ListEmptyComponent={renderEmptyGenreResults}
          columnWrapperStyle={styles.movieRow}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1D36',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E9A6A6',
  },
  genreList: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  genreCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2C294A',
    borderWidth: 2,
    borderColor: 'transparent',
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  genreCardSelected: {
    backgroundColor: '#3F3B6C',
  },
  genreIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  genreName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#A5A5A5',
    fontSize: 16,
  },
  movieList: {
    padding: 12,
    flexGrow: 1,
  },
  movieRow: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#2C294A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: 180,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  ratingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  movieDetails: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#A5A5A5',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#A5A5A5',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default GenresExplorerScreen; 