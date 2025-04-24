import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getMoviesByGenre } from '../services/api'; // Using our new API function
import Loading from '../components/Loading';

type GenreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Genre'>;
type GenreScreenRouteProp = RouteProp<RootStackParamList, 'Genre'>;

interface GenreMovie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: string;
  genres?: string[];
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24;

const GENRES = {
  action: {
    title: 'Action',
    description: 'Exciting films with thrilling sequences, explosions, and heroic characters',
    color: ['#FF416C', '#FF4B2B']
  },
  comedy: {
    title: 'Comedy',
    description: 'Films designed to make the audience laugh through humor and entertainment',
    color: ['#4E65FF', '#92EFFD']
  },
  horror: {
    title: 'Horror',
    description: 'Scary movies that aim to frighten and panic viewers with tension and suspense',
    color: ['#000000', '#434343']
  },
  drama: {
    title: 'Drama',
    description: 'Character-driven plots focusing on realistic emotional themes',
    color: ['#654ea3', '#eaafc8']
  },
  scifi: {
    title: 'Sci-Fi',
    description: 'Imaginative and futuristic concepts such as advanced science and technology',
    color: ['#43cea2', '#185a9d']
  }
};

const GenreScreen = () => {
  const navigation = useNavigation<GenreScreenNavigationProp>();
  const route = useRoute<GenreScreenRouteProp>();

  const [movies, setMovies] = useState<GenreMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const genreId = route.params?.genreId || 'action';
  const genreInfo = GENRES[genreId as keyof typeof GENRES] || GENRES.action;

  useEffect(() => {
    loadMovies();
  }, [genreId]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      // Get movies for this genre using our API
      const genreMovies = await getMoviesByGenre(genreInfo.title);

      // Format for our UI
      const formattedMovies = genreMovies.map((movie: any) => ({
        id: movie.id,
        title: movie.primaryTitle || movie.originalTitle,
        image: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        year: movie.startYear?.toString() || 'Unknown',
        rating: (movie.averageRating || '0') + '/10',
        genres: movie.genres || [genreInfo.title]
      }));

      setMovies(formattedMovies);
    } catch (error) {
      console.error('Error loading genre movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      // This would fetch the next page of results in a real app
      // Simulate a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo, just duplicate some movies with new IDs
      const moreMovies = movies.slice(0, 4).map((movie, index) => ({
        ...movie,
        id: `${movie.id}-more-${index}`
      }));

      setMovies(prev => [...prev, ...moreMovies]);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderMovieItem = ({ item }: { item: GenreMovie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetails', {
        movieId: item.id,
        movie: { id: item.id, title: item.title }
      })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.poster} />

      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#E9A6A6" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>

        {item.genres && (
          <View style={styles.genresContainer}>
            {item.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.bookmarkButton}>
        <Ionicons name="bookmark-outline" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#E9A6A6" />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  if (loading) {
    return <Loading message={`Loading ${genreInfo.title} movies...`} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <LinearGradient
        colors={genreInfo.color}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.genreTitle}>{genreInfo.title}</Text>
          <Text style={styles.genreDescription}>{genreInfo.description}</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreMovies}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1D36',
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerContent: {
    paddingHorizontal: 8,
  },
  genreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genreDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  movieCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#2C2A4A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
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
    color: '#9795B5',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#E9A6A6',
    marginLeft: 4,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 10,
    color: '#fff',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: '#9795B5',
    fontSize: 14,
  },
});

export default GenreScreen; 