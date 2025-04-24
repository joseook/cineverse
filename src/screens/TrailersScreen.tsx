import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getLowestRatedMovies } from '../services/api'; // Reusing this API for demo
import Loading from '../components/Loading';

type TrailersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Trailers'>;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 24;

interface Trailer {
  id: string;
  movieId: string;
  title: string;
  thumbnail: string;
  duration: string;
  movieTitle: string;
  year: string;
}

const TrailersScreen = () => {
  const navigation = useNavigation<TrailersScreenNavigationProp>();
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchTrailers();
  }, []);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch from a trailers API
      // Here we're reusing the movie API for demonstration
      const movies = await getLowestRatedMovies();

      // Mock data by transforming the movies into trailers
      const mockTrailers = movies.map((movie: any, index: number) => ({
        id: `trailer-${index}-${movie.id}`,
        movieId: movie.id,
        title: `Official Trailer ${index % 3 === 0 ? '#1' : index % 3 === 1 ? '#2' : 'Final'}`,
        thumbnail: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        duration: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
        movieTitle: movie.primaryTitle || movie.originalTitle,
        year: movie.startYear?.toString() || 'Unknown'
      }));

      setTrailers(mockTrailers);
    } catch (error) {
      console.error('Error fetching trailers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrailerPress = (trailer: Trailer) => {
    setSelectedTrailer(trailer);
    setModalVisible(true);
    // In a real app, we would open a video player
  };

  const renderTrailerItem = ({ item }: { item: Trailer }) => (
    <TouchableOpacity
      style={styles.trailerCard}
      onPress={() => handleTrailerPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.playButton}>
          <Ionicons name="play" size={20} color="#fff" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.trailerInfo}>
        <Text style={styles.trailerTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.movieTitle} ({item.year})
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Loading trailers..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trailers</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={trailers}
        renderItem={renderTrailerItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Trailer Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {selectedTrailer && (
              <View style={styles.trailerPreview}>
                <View style={styles.videoContainer}>
                  <Image
                    source={{ uri: selectedTrailer.thumbnail }}
                    style={styles.videoPlaceholder}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.playText}>
                      Video playback would start here in a real app
                    </Text>
                  </View>
                </View>

                <View style={styles.trailerDetails}>
                  <Text style={styles.modalTrailerTitle}>
                    {selectedTrailer.movieTitle} - {selectedTrailer.title}
                  </Text>
                  <Text style={styles.modalTrailerInfo}>
                    {selectedTrailer.year} • {selectedTrailer.duration}
                  </Text>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="share-outline" size={24} color="#fff" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="heart-outline" size={24} color="#fff" />
                      <Text style={styles.actionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('MovieDetails', {
                          movieId: selectedTrailer.movieId,
                          movie: { id: selectedTrailer.movieId, title: selectedTrailer.movieTitle }
                        });
                      }}
                    >
                      <Ionicons name="information-circle-outline" size={24} color="#fff" />
                      <Text style={styles.actionText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
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
  searchButton: {
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trailerCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#2C2A4A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: ITEM_WIDTH * 0.6,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  playButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 166, 166, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  trailerInfo: {
    padding: 10,
  },
  trailerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieTitle: {
    fontSize: 12,
    color: '#E9A6A6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerPreview: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playText: {
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  trailerDetails: {
    padding: 20,
  },
  modalTrailerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalTrailerInfo: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 8,
  },
});

export default TrailersScreen; 