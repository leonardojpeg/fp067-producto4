import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, ScrollView, Platform } from 'react-native';
import { db } from '../firebaseConfig'; 
import { ref, onValue } from 'firebase/database';

const POSICIONES = ['Todas', 'Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot'];

export default function Inicio({ navigation }) {
  const [todosLosJugadores, setTodosLosJugadores] = useState([]);
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPosicion, setFiltroPosicion] = useState('Todas');

  useEffect(() => {
    const jugadoresRef = ref(db, "/"); 
    const unsub = onValue(jugadoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTodosLosJugadores(lista);
        setJugadoresFiltrados(lista);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let filtrados = todosLosJugadores.filter(j => {
      const nombreCompleto = `${j.nombre || ""} ${j.apellidos || ""}`;
      const cumpleNombre = nombreCompleto.toLowerCase().includes(busqueda.toLowerCase());
      const cumplePosicion = filtroPosicion === 'Todas' || j.posicion === filtroPosicion;
      return cumpleNombre && cumplePosicion;
    });
    setJugadoresFiltrados(filtrados);
  }, [busqueda, filtroPosicion, todosLosJugadores]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Detalle', { reto: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.nombre} {item.apellidos}</Text>
        <View style={styles.posicionBadge}>
          <Text style={styles.posicionText}>{item.posicion}</Text>
        </View>
      </View>
      <Text style={styles.equipoText}>Equipo: {item.equipo}</Text>
      <Text style={styles.infoText}>Edad: {item.edad} | Altura: {item.altura} | Dorsal: {item.dorsal}</Text>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteText}>Eliminar</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, equipo..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtros horizontales */}
      <View style={{ height: 60 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {POSICIONES.map(pos => (
            <TouchableOpacity 
              key={pos} 
              style={[styles.filterBtn, filtroPosicion === pos && styles.filterBtnActive]}
              onPress={() => setFiltroPosicion(pos)}
            >
              <Text style={[styles.filterText, filtroPosicion === pos && styles.filterTextActive]}>{pos}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* El secreto del scroll está en que este View tenga flex: 1 */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0D1B3E" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={jugadoresFiltrados}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            // Esto asegura que en Web el scroll sea fluido
            style={Platform.OS === 'web' ? { height: 'calc(100vh - 200px)' } : { flex: 1 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  searchContainer: { backgroundColor: '#0D1B3E', padding: 15 },
  searchInput: { backgroundColor: '#FFF', borderRadius: 5, padding: 10 },
  filtersContainer: { paddingVertical: 10, paddingHorizontal: 10 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, backgroundColor: '#E0E0E0', marginRight: 8, height: 40 },
  filterBtnActive: { backgroundColor: '#0D1B3E' },
  filterText: { color: '#333', fontWeight: 'bold' },
  filterTextActive: { color: '#FFF' },
  listContent: { paddingBottom: 40 },
  card: { 
    backgroundColor: '#FFFBE6', 
    marginHorizontal: 15, 
    marginTop: 15, 
    borderRadius: 10, 
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#FDB927',
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  posicionBadge: { backgroundColor: '#2F70F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  posicionText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  equipoText: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  infoText: { fontSize: 13, color: '#444' },
  deleteButton: { backgroundColor: '#E74C3C', width: 80, padding: 6, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  deleteText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});