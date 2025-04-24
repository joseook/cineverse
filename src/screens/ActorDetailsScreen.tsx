import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import Loading from '../components/Loading';
import { getLowestRatedMovies } from '../services/api'; // Used for demo purposes

type ActorDetailsRouteProp = RouteProp<RootStackParamList, 'ActorDetails'>;

// Demo actor data - in a real app, this would come from an API
const DEMO_ACTORS = [
  {
    id: 'nm0000138',
    name: 'Leonardo DiCaprio',
    image: 'https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UY317_CR10,0,214,317_AL_.jpg',
    bio: 'Leonardo Wilhelm DiCaprio is an American actor, producer, and environmentalist. He has often played unconventional roles, particularly in biopics and period films.',
    birthDate: 'November 11, 1974',
    birthPlace: 'Los Angeles, California, USA',
    awards: ['1 Academy Award', '3 Golden Globe Awards', '1 BAFTA Award'],
    knownFor: ['Titanic', 'Inception', 'The Revenant', 'The Wolf of Wall Street']
  },
  {
    id: 'nm0000204',
    name: 'Keanu Reeves',
    image: 'https://m.media-amazon.com/images/M/MV5BYmUzMjE1OWYtMzk2Ni00ZDRiLTgzY2YtYmVhZjY5Y2YwYWZhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY317_CR51,0,214,317_AL_.jpg',
    bio: 'Keanu Charles Reeves is a Canadian actor. Born in Beirut and raised in Toronto, Reeves began acting in theatre productions and in television films before making his feature film debut in Youngblood.',
    birthDate: 'September 2, 1964',
    birthPlace: 'Beirut, Lebanon',
    awards: ['Star on the Hollywood Walk of Fame'],
    knownFor: ['The Matrix', 'John Wick', 'Speed', 'Point Break']
  },
  {
    id: 'nm0000701',
    name: 'Scarlett Johansson',
    image: 'https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_UY317_CR23,0,214,317_AL_.jpg',
    bio: 'Scarlett Johansson is an American actress and singer. She was among the world\'s highest-paid actresses from 2014 to 2016, has made multiple appearances in the Forbes Celebrity 100, and has a star on the Hollywood Walk of Fame.',
    birthDate: 'November 22, 1984',
    birthPlace: 'New York City, New York, USA',
    awards: ['BAFTA Award', 'Tony Award'],
    knownFor: ['Lost in Translation', 'Black Widow', 'Marriage Story', 'The Avengers']
  }
];

interface Movie {
  id: string;
  title: string;
  year: string;
  image: string;
  role?: string;
  character?: string;
}

interface Actor {
  id: string;
  name: string;
  image: string;
  bio: string;
  birthDate: string;
  birthPlace: string;
  awards: string[];
  knownFor: string[];
  filmography?: Movie[];
}

const ActorDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ActorDetailsRouteProp>();
  const { actorId } = route.params;

  const [actor, setActor] = useState<Actor | null>(null);
  const [filmography, setFilmography] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    fetchActorDetails();
  }, [actorId]);

  const fetchActorDetails = async () => {
    try {
      setLoading(true);

      // In a real app, this would fetch from an actor details API
      // For this demo, we're using mock data
      const actorDetails = DEMO_ACTORS.find(a => a.id === actorId);

      if (!actorDetails) {
        throw new Error('Actor not found');
      }

      setActor(actorDetails);

      // Mock filmography data using our existing movie API
      const movies = await getLowestRatedMovies();

      // Transform into filmography with roles
      const mockFilmography = movies.slice(0, 10).map((movie: any, index: number) => ({
        id: movie.id,
        title: movie.primaryTitle || movie.originalTitle,
        year: movie.startYear?.toString() || 'Unknown',
        image: movie.primaryImage || 'https://via.placeholder.com/300x450?text=No+Image',
        role: index % 3 === 0 ? 'Lead Actor' : index % 3 === 1 ? 'Supporting Role' : 'Cameo',
        character: `Character ${index + 1}`
      }));

      setFilmography(mockFilmography);
    } catch (error) {
      console.error('Error fetching actor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.movieImage} />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieYear}>{item.year}</Text>
        {item.character && (
          <Text style={styles.character}>as {item.character}</Text>
        )}
        {item.role && (
          <View style={styles.roleContainer}>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading message="Loading actor details..." />;
  }

  if (!actor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Actor not found</Text>
      </View>
    );
  }

  const toggleBioExpanded = () => {
    setBioExpanded(!bioExpanded);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1D36" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={{ uri: actor.image }}
            style={styles.actorImage}
          />
          <LinearGradient
            colors={['transparent', '#1F1D36']}
            style={styles.headerGradient}
          />
          <View style={styles.actorInfo}>
            <Text style={styles.actorName}>{actor.name}</Text>
            <Text style={styles.birthInfo}>
              Born: {actor.birthDate} • {actor.birthPlace}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text
              style={styles.bio}
              numberOfLines={bioExpanded ? undefined : 3}
            >
              {actor.bio}
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={toggleBioExpanded}
            >
              <Text style={styles.readMoreText}>
                {bioExpanded ? 'Show Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Known For</Text>
            <View style={styles.knownForContainer}>
              {actor.knownFor.map((title, index) => (
                <View key={index} style={styles.knownForItem}>
                  <Text style={styles.knownForText}>{title}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Achievements</Text>
            {actor.awards.map((award, index) => (
              <View key={index} style={styles.awardItem}>
                <Ionicons name="trophy" size={18} color="#E9A6A6" style={styles.awardIcon} />
                <Text style={styles.awardText}>{award}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.filmographySection}>
            <Text style={styles.sectionTitle}>Filmography</Text>
            {filmography.map(movie => (
              <View key={movie.id} style={styles.filmographyItem}>
                {renderMovieItem({ item: movie })}
              </View>
            ))}
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
  header: {
    height: 400,
    position: 'relative',
  },
  actorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  actorInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  actorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  birthInfo: {
    fontSize: 14,
    color: '#E9A6A6',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E9A6A6',
    marginBottom: 16,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#ddd',
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    color: '#E9A6A6',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#3F3B6C',
    marginVertical: 16,
  },
  knownForContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  knownForItem: {
    backgroundColor: '#3F3B6C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  knownForText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  awardIcon: {
    marginRight: 8,
  },
  awardText: {
    color: '#ddd',
    fontSize: 15,
  },
  filmographySection: {
    marginBottom: 40,
  },
  filmographyItem: {
    marginBottom: 16,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#2C294A',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  movieImage: {
    width: 80,
    height: 120,
  },
  movieDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: '#A5A5A5',
    marginBottom: 6,
  },
  character: {
    fontSize: 14,
    color: '#E9A6A6',
    marginBottom: 6,
  },
  roleContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(233, 166, 166, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  role: {
    fontSize: 12,
    color: '#E9A6A6',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1D36',
  },
  errorText: {
    color: '#E9A6A6',
    fontSize: 16,
  },
});

export default ActorDetailsScreen; 