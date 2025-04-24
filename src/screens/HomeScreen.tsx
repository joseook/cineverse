import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { getLowestRatedMovies, getMovieDetails } from '../services/api';
import { Movie } from '../utils/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [lowestRatedMovies, setLowestRatedMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('year');
  const scrollY = new Animated.Value(0);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      // Get lowest rated movies
      const lowestRated = await getLowestRatedMovies();

      // Split the data for our categories
      const popularMovies = lowestRated.slice(0, 5);
      const lowestRatedMovies = lowestRated.slice(5, 10);
      const allMovies = [...lowestRated];

      // Format the movies for our app format
      const formatMovies = (movies) => movies.map((movie) => ({
        id: movie.id,
        title: movie.primaryTitle || movie.originalTitle,
        year: movie.startYear?.toString() || 'Unknown',
        image: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        imDbRating: movie.averageRating?.toString() || '',
        plot: movie.description,
        genres: movie.genres || [],
      }));

      setPopularMovies(formatMovies(popularMovies));
      setLowestRatedMovies(formatMovies(lowestRatedMovies));
      setAllMovies(formatMovies(allMovies));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', {
      movieId: movie.id,
      movie: movie,
    });
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );

  const filterMoviesByCategory = (movies: Movie[], category: string) => {
    if (category === 'All') return movies;
    return movies.filter(movie =>
      movie.genres && movie.genres.some(genre =>
        genre.toLowerCase() === category.toLowerCase()
      )
    );
  };

  const sortMovies = (movies: Movie[], sortBy: string) => {
    const sorted = [...movies];
    if (sortBy === 'year') {
      return sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortBy === 'rating') {
      return sorted.sort((a, b) => parseFloat(b.imDbRating) - parseFloat(a.imDbRating));
    } else if (sortBy === 'name') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      {/* Animated Header Background */}
      <Animated.View
        style={[
          styles.headerBackground,
          { opacity: headerOpacity }
        ]}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E9A6A6" />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>CineVerse</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Genres')}
            >
              <Ionicons name="grid-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons name="options-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => {
                  if (category === 'All') {
                    setActiveCategory(category);
                  } else {
                    // Navigate to specific genre screen
                    navigation.navigate('Genre', {
                      genreId: category.toLowerCase()
                    });
                  }
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Genres Banner */}
        <TouchableOpacity
          style={styles.genresBanner}
          onPress={() => navigation.navigate('Genres')}
          activeOpacity={0.9}
        >
          <View style={styles.genresBannerContent}>
            <Text style={styles.genresBannerTitle}>Explore Movie Genres</Text>
            <Text style={styles.genresBannerSubtitle}>Discover films by categories</Text>
          </View>
          <View style={styles.genresBannerIcon}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          {renderSectionHeader('Popular Movies')}
          <FlatList
            data={sortMovies(filterMoviesByCategory(popularMovies, activeCategory), sortBy)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MovieCard movie={item} onPress={handleMoviePress} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No movies found in this category</Text>
              </View>
            }
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader('Lowest Rated Movies')}
          <FlatList
            data={sortMovies(filterMoviesByCategory(lowestRatedMovies, activeCategory), sortBy)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MovieCard movie={item} onPress={handleMoviePress} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No movies found in this category</Text>
              </View>
            }
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader('All Movies')}
          <FlatList
            data={sortMovies(filterMoviesByCategory(allMovies, activeCategory), sortBy)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MovieCard movie={item} onPress={handleMoviePress} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No movies found in this category</Text>
              </View>
            }
          />
        </View>
      </Animated.ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.sortSection}>
              <Text style={styles.sectionLabel}>Sort By</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'year' && styles.sortOptionActive]}
                  onPress={() => setSortBy('year')}
                >
                  <Text style={sortBy === 'year' ? styles.sortTextActive : styles.sortText}>Year</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'rating' && styles.sortOptionActive]}
                  onPress={() => setSortBy('rating')}
                >
                  <Text style={sortBy === 'rating' ? styles.sortTextActive : styles.sortText}>Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortOption, sortBy === 'name' && styles.sortOptionActive]}
                  onPress={() => setSortBy('name')}
                >
                  <Text style={sortBy === 'name' ? styles.sortTextActive : styles.sortText}>Name</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1F1D36',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F1D36',
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E9A6A6',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  categoryContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#E9A6A6',
  },
  categoryText: {
    color: '#fff',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#1F1D36',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    color: '#A267AC',
    fontWeight: '600',
  },
  movieList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  emptyContainer: {
    width: width - 40,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  emptyText: {
    color: '#A5A5A5',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sortSection: {
    marginBottom: 20,
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  sortOptionActive: {
    backgroundColor: '#3F3B6C',
  },
  sortText: {
    color: '#333',
  },
  sortTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#E9A6A6',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    fontWeight: 'bold',
    color: '#1F1D36',
    fontSize: 16,
  },
  genresBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#3F3B6C',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genresBannerContent: {
    flex: 1,
  },
  genresBannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  genresBannerSubtitle: {
    color: '#E9A6A6',
    fontSize: 14,
  },
  genresBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 