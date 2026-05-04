import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function Detalle({ route, navigation }) {
  const { reto } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Detalle del jugador</Text>
      
      {/* Cabecera Azul de la imagen */}
      <View style={styles.blueCard}>
        <Image source={{ uri: reto.imagen }} style={styles.playerImage} />
        <View style={styles.mainInfo}>
          <Text style={styles.teamUpper}>{reto.equipo}</Text>
          <Text style={styles.nameUpper}>{reto.nombre} {reto.apellidos}</Text>
          <View style={styles.posBadgeDetail}>
            <Text style={styles.posTextDetail}>{reto.posicion}</Text>
          </View>
        </View>
      </View>

      {/* Grid de información */}
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>EDAD</Text>
          <Text style={styles.val}>{reto.edad}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>ALTURA</Text>
          <Text style={styles.val}>{reto.altura}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>DORSAL</Text>
          <Text style={styles.val}>#{reto.dorsal}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>POSICIÓN</Text>
          <Text style={styles.val}>{reto.posicion}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Equipo</Text>
          <Text style={styles.val}>{reto.equipo}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Estado</Text>
          <Text style={[styles.val, {color: '#28A745'}]}>● Disponible</Text>
        </View>
      </View>

      <View style={styles.bioBox}>
        <Text style={styles.label}>Perfil</Text>
        <Text style={styles.bioText}>{reto.perfil || "Sin descripción."}</Text>
      </View>

      <TouchableOpacity 
        style={styles.videoBtn} 
        onPress={() => navigation.navigate('Reproductor', { url: reto.video })}
      >
        <Text style={styles.videoBtnText}>VER VÍDEO DEL JUGADOR</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  blueCard: { 
    backgroundColor: '#1A4AB2', 
    borderRadius: 15, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  playerImage: { width: 90, height: 90, borderRadius: 10, backgroundColor: '#333' },
  mainInfo: { marginLeft: 15, flex: 1 },
  teamUpper: { color: '#DDD', fontSize: 12, fontWeight: 'bold' },
  nameUpper: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
  posBadgeDetail: { backgroundColor: '#555', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, alignSelf: 'flex-start' },
  posTextDetail: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  gridItem: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    // Sombra suave
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  label: { color: '#999', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  val: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 4 },
  bioBox: { padding: 15, borderTopWidth: 1, borderTopColor: '#EEE' },
  bioText: { fontSize: 15, color: '#555', lineHeight: 22 },
  videoBtn: { backgroundColor: '#1A4AB2', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  videoBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});