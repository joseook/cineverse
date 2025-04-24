import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getTopRatedMovies } from '../services/api'; // Using top rated movies instead
import Loading from '../components/Loading';

type WatchlistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Watchlist'>;

interface WatchlistMovie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: string;
  addedOn: string;
  description?: string;
}

const { width } = Dimensions.get('window');

const WatchlistScreen = () => {
  const navigation = useNavigation<WatchlistScreenNavigationProp>();
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      // In a real app, we would fetch from AsyncStorage or a backend
      // Here we're using mock data based on the API
      setLoading(true);
      const movies = await getTopRatedMovies();

      // Take only 5 movies for the demo watchlist
      const mockWatchlist = movies.slice(0, 5).map((movie: any) => ({
        id: movie.id,
        title: movie.primaryTitle || movie.originalTitle,
        image: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        year: movie.startYear?.toString() || 'Unknown',
        rating: (movie.rating?.ratingValue || '0') + '/10',
        addedOn: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toLocaleDateString(),
        description: movie.plot
      }));

      setWatchlist(mockWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (id: string) => {
    Alert.alert(
      'Remove from Watchlist',
      'Are you sure you want to remove this movie from your watchlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setWatchlist(prev => prev.filter(movie => movie.id !== id));
          }
        }
      ]
    );
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => removeFromWatchlist(id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: WatchlistMovie }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('MovieDetails', {
          movieId: item.id,
          movie: { id: item.id, title: item.title }
        })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.image }} style={styles.poster} />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.year}>{item.year}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#E9A6A6" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.addedLabel}>Added: </Text>
            <Text style={styles.addedDate}>{item.addedOn}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return <Loading message="Loading your watchlist..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => Alert.alert('Sort', 'Sort options would appear here')}
        >
          <Ionicons name="options-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {watchlist.length > 0 ? (
        <FlatList
          data={watchlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={80} color="#3F3B6C" />
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Movies and TV shows you save to your watchlist will appear here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3F3B6C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2A4A',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 140,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#9795B5',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#E9A6A6',
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedLabel: {
    fontSize: 12,
    color: '#9795B5',
  },
  addedDate: {
    fontSize: 12,
    color: '#fff',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E9A6A6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  deleteAction: {
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9795B5',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#E9A6A6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#1F1D36',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WatchlistScreen; 