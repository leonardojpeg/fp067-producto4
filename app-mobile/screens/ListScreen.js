import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const POSICIONES = ['Todas', 'Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

export default function ListScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('Todas');

  // Cargar TODOS los datos de Firebase Realtime Database
  useEffect(() => {
    const playersRef = ref(db, '/');
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setPlayers(list);
        setFilteredPlayers(list);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtrar por búsqueda y posición
  useEffect(() => {
    let result = players;

    if (searchText) {
      const text = searchText.toLowerCase().trim();
      result = result.filter((p) => {
        const fullName = `${p.nombre || ''} ${p.apellidos || ''}`.toLowerCase();
        const team = (p.equipo || '').toLowerCase();
        return fullName.includes(text) || team.includes(text);
      });
    }

    if (selectedPosition !== 'Todas') {
      result = result.filter(
        (p) => p.posicion && p.posicion.toLowerCase() === selectedPosition.toLowerCase()
      );
    }

    setFilteredPlayers(result);
  }, [searchText, selectedPosition, players]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { player: item })}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${item.nombre} ${item.apellidos}`}
    >
      <View style={styles.cardRow}>
        {item.imagen ? (
          <Image source={{ uri: item.imagen }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderImg]}>
            <Text style={styles.placeholderText}>
              {(item.nombre || '?').charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.playerName}>
              {item.nombre} {item.apellidos}
            </Text>
            <View style={styles.positionBadge}>
              <Text style={styles.positionText}>{item.posicion}</Text>
            </View>
          </View>
          <Text style={styles.teamText}>{item.equipo}</Text>
          <Text style={styles.infoText}>
            Edad: {item.edad} | Altura: {item.altura} | Dorsal: #{item.dorsal}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0D1B3E" />
        <Text style={styles.loadingText}>Cargando jugadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o equipo..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          accessibilityLabel="Buscar jugadores"
        />
      </View>

      {/* Filtros de posición */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {POSICIONES.map((pos) => (
            <TouchableOpacity
              key={pos}
              style={[
                styles.filterBtn,
                selectedPosition === pos && styles.filterBtnActive,
              ]}
              onPress={() => setSelectedPosition(pos)}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por posición ${pos}`}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPosition === pos && styles.filterTextActive,
                ]}
              >
                {pos}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de jugadores */}
      <FlatList
        data={filteredPlayers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron jugadores.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  searchContainer: { backgroundColor: '#0D1B3E', padding: 15 },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  filtersWrapper: { height: 55, backgroundColor: '#FFF', elevation: 2 },
  filtersContent: { paddingHorizontal: 10, alignItems: 'center' },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#0D1B3E' },
  filterText: { color: '#333', fontWeight: 'bold', fontSize: 13 },
  filterTextActive: { color: '#FFF' },
  listContent: { paddingBottom: 30 },
  card: {
    backgroundColor: '#FFFBE6',
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FDB927',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  thumbnail: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  placeholderImg: {
    backgroundColor: '#0D1B3E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#FDB927', fontSize: 24, fontWeight: 'bold' },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: { fontSize: 16, fontWeight: 'bold', color: '#000', flex: 1 },
  positionBadge: {
    backgroundColor: '#2F70F2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  positionText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  teamText: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 2 },
  infoText: { fontSize: 12, color: '#666', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' },
});
