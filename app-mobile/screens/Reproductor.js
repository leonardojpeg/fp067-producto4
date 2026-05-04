import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function Reproductor({ route, navigation }) {
  const { url } = route.params;

  // Limpiamos la URL para sacar el ID
  const getID = (link) => {
    if (!link) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const videoId = getID(url);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <View style={styles.videoContainer}>
        {/* Usamos el elemento nativo de la web que no necesita librerías */}
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&controls=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="NBA Video"
        ></iframe>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Proporción panorámica de YouTube
    backgroundColor: '#111',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FDB927',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    color: '#552583',
    fontWeight: 'bold',
  }
});