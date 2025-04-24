import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoadingProps {
  message?: string;
  customStyle?: object;
  showBranding?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  customStyle = {},
  showBranding = true
}) => {
  return (
    <View style={[styles.container, customStyle]}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#E9A6A6" />
        <Text style={styles.text}>{message}</Text>
      </View>
      {showBranding && (
        <View style={styles.branding}>
          <Text style={styles.brandingText}>CineVerse</Text>
          <Ionicons name="film-outline" size={20} color="#3F3B6C" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1D36',
    paddingBottom: 40,
  },
  loadingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#E9A6A6',
    fontWeight: '500',
  },
  branding: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandingText: {
    color: '#3F3B6C',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  }
});

export default Loading; 