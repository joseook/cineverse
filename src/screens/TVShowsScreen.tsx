import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getLowestRatedMovies } from '../services/api'; // Reusing this API for demo
import Loading from '../components/Loading';

type TVShowsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TVShows'>;

const { width, height } = Dimensions.get('window');

// TV show categories
const TV_CATEGORIES = [
  { id: 'popular', name: 'Popular Shows' },
  { id: 'trending', name: 'Trending This Week' },
  { id: 'toprated', name: 'Top Rated' },
  { id: 'scifi', name: 'Sci-Fi & Fantasy' },
  { id: 'drama', name: 'Drama' },
  { id: 'comedy', name: 'Comedy' },
];

// Mock featured show for the hero section
const FEATURED_SHOW = {
  id: 'tt0944947',
  title: 'Game of Thrones',
  image: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
  year: '2011-2019',
  rating: '9.2',
  description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
  genres: ['Action', 'Adventure', 'Drama']
};

interface TVShow {
  id: string;
  title: string;
  image: string;
  year: string;
  rating?: string;
  description?: string;
  genres?: string[];
  seasons?: number;
}

const TVShowsScreen = () => {
  const navigation = useNavigation<TVShowsScreenNavigationProp>();
  const [tvShows, setTvShows] = useState<{ [key: string]: TVShow[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTVShows();
  }, []);

  const fetchTVShows = async () => {
    try {
      setLoading(true);

      // In a real app, we would fetch from a TV Shows API
      // Here we're reusing the movie API for demonstration
      const shows = await getLowestRatedMovies();

      // Mock data by transforming the movies into TV shows and categorizing them
      const formattedShows = shows.map((show: any, index: number) => ({
        id: show.id,
        title: show.primaryTitle || show.originalTitle,
        image: show.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        year: `${show.startYear || 2010}-${(show.startYear || 2010) + (index % 8) + 1}`,
        rating: show.averageRating?.toString() || '',
        description: show.description,
        genres: show.genres || [],
        seasons: (index % 8) + 1
      }));

      // Create categories by slicing the array in different ways
      const categorizedShows = {
        popular: formattedShows.slice(0, 8),
        trending: formattedShows.slice(8, 16).reverse(),
        toprated: [...formattedShows].sort((a, b) =>
          parseFloat(b.rating || '0') - parseFloat(a.rating || '0')
        ).slice(0, 8),
        scifi: formattedShows.filter(show =>
          show.genres && show.genres.some(g =>
            g.toLowerCase() === 'sci-fi' || g.toLowerCase() === 'fantasy'
          )
        ).slice(0, 8),
        drama: formattedShows.filter(show =>
          show.genres && show.genres.some(g => g.toLowerCase() === 'drama')
        ).slice(0, 8),
        comedy: formattedShows.filter(show =>
          show.genres && show.genres.some(g => g.toLowerCase() === 'comedy')
        ).slice(0, 8),
      };

      setTvShows(categorizedShows);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPress = (show: TVShow) => {
    // Navigate to MovieDetails screen instead of showing an alert
    navigation.navigate('MovieDetails', {
      movieId: show.id,
      movie: {
        id: show.id,
        title: show.title,
        image: show.image,
        year: show.year,
        plot: show.description,
        genres: show.genres,
        imDbRating: show.rating
      }
    });
  };

  const renderShowItem = ({ item }: { item: TVShow }) => (
    <TouchableOpacity
      style={styles.showCard}
      onPress={() => handleShowPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.showImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        {item.seasons && (
          <View style={styles.seasonsContainer}>
            <Text style={styles.seasonsText}>{item.seasons} {item.seasons > 1 ? 'Seasons' : 'Season'}</Text>
          </View>
        )}
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.showDetails}>
        <Text style={styles.showTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.showYear}>{item.year}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategorySection = (categoryId: string, categoryName: string) => {
    const shows = tvShows[categoryId] || [];

    if (shows.length === 0) return null;

    return (
      <View style={styles.categorySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{categoryName}</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={shows}
          renderItem={renderShowItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.showsList}
        />
      </View>
    );
  };

  if (loading) {
    return <Loading message="Loading TV shows..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>TV Shows</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Featured Show */}
        <TouchableOpacity
          style={styles.featuredContainer}
          onPress={() => handleShowPress(FEATURED_SHOW as TVShow)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: FEATURED_SHOW.image }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(31, 29, 54, 0.9)', '#1F1D36']}
            style={styles.featuredGradient}
          />
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            <Text style={styles.featuredTitle}>{FEATURED_SHOW.title}</Text>
            <Text style={styles.featuredYear}>{FEATURED_SHOW.year}</Text>

            <View style={styles.featuredGenres}>
              {FEATURED_SHOW.genres.map((genre, index) => (
                <View key={`genre-${genre}-${index}`} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.featuredDescription} numberOfLines={3}>
              {FEATURED_SHOW.description}
            </Text>

            <View style={styles.featuredButtons}>
              <TouchableOpacity style={styles.watchButton}>
                <Ionicons name="play" size={16} color="#1F1D36" />
                <Text style={styles.watchButtonText}>Watch Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* TV Show Categories */}
        {TV_CATEGORIES.map(category => (
          <React.Fragment key={category.id}>
            {renderCategorySection(category.id, category.name)}
          </React.Fragment>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Content provided for demo purposes</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E9A6A6',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  featuredContainer: {
    height: 480,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  featuredContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: '#E9A6A6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#1F1D36',
    fontWeight: 'bold',
    fontSize: 12,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featuredYear: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 12,
  },
  featuredGenres: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  genrePill: {
    backgroundColor: 'rgba(63, 59, 108, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredDescription: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9A6A6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
  },
  watchButtonText: {
    color: '#1F1D36',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 20,
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
    color: '#E9A6A6',
    fontWeight: '600',
  },
  showsList: {
    paddingLeft: 12,
    paddingRight: 20,
  },
  showCard: {
    width: 150,
    marginLeft: 8,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#2C294A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  showImage: {
    width: '100%',
    height: 225,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  seasonsContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(63, 59, 108, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seasonsText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  showDetails: {
    padding: 12,
  },
  showTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  showYear: {
    fontSize: 12,
    color: '#A5A5A5',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#A5A5A5',
    fontSize: 12,
  }
});

export default TVShowsScreen; 