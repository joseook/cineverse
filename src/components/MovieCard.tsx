import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../utils/types';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2.5;

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  // Function to create genre pills with limited display
  const renderGenrePills = () => {
    if (!movie.genres || movie.genres.length === 0) return null;

    // Only show up to 2 genres
    const visibleGenres = movie.genres.slice(0, 2);

    return (
      <View style={styles.genreContainer}>
        {visibleGenres.map((genre, index) => (
          <View key={index} style={styles.genrePill}>
            <Text style={styles.genreText}>{genre}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: movie.image || 'https://via.placeholder.com/300x450?text=No+Image' }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        {movie.imDbRating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={styles.rating}>{movie.imDbRating}</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.year}>{movie.year}</Text>
        {renderGenrePills()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#2C294A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  details: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  year: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genrePill: {
    backgroundColor: '#3F3B6C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    color: '#E9A6A6',
    fontSize: 10,
    fontWeight: '500',
  },
});

export default MovieCard; 