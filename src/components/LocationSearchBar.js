import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setOrigin, setDestination, selectOrigin } from '../store/navSlice';

const MOCK_PLACES = [
  // Zonas y Barrios
  { description: 'El Poblado, Medellín', location: { latitude: 6.2087, longitude: -75.5705 } },
  { description: 'Laureles, Medellín', location: { latitude: 6.2442, longitude: -75.5997 } },
  { description: 'Envigado, Antioquia', location: { latitude: 6.1720, longitude: -75.5908 } },
  { description: 'Bello, Antioquia', location: { latitude: 6.3329, longitude: -75.5560 } },
  { description: 'Sabaneta, Antioquia', location: { latitude: 6.1515, longitude: -75.6163 } },
  { description: 'Itagüí, Antioquia', location: { latitude: 6.1738, longitude: -75.6025 } },
  // Sitios Turísticos
  { description: 'Pueblito Paisa, Medellín', location: { latitude: 6.2366, longitude: -75.5804 } },
  { description: 'Comuna 13 (Escaleras Eléctricas)', location: { latitude: 6.2530, longitude: -75.6146 } },
  { description: 'Parque Lleras, El Poblado', location: { latitude: 6.2081, longitude: -75.5670 } },
  { description: 'Jardín Botánico de Medellín', location: { latitude: 6.2690, longitude: -75.5645 } },
  { description: 'Museo de Antioquia', location: { latitude: 6.2523, longitude: -75.5686 } },
  { description: 'Plaza Botero, Medellín', location: { latitude: 6.2518, longitude: -75.5636 } },
  { description: 'Parque Arví', location: { latitude: 6.2731, longitude: -75.4876 } },
  { description: 'Parque Explora', location: { latitude: 6.2679, longitude: -75.5658 } },
  // Universidades y Clínicas
  { description: 'Universidad de Antioquia (UdeA)', location: { latitude: 6.2676, longitude: -75.5674 } },
  { description: 'Universidad Nacional (Sede Medellín)', location: { latitude: 6.2605, longitude: -75.5786 } },
  { description: 'Universidad EAFIT', location: { latitude: 6.2005, longitude: -75.5784 } },
  { description: 'Clínica Las Américas', location: { latitude: 6.2205, longitude: -75.5991 } },
  // Transporte y Estadios
  { description: 'Aeropuerto Olaya Herrera', location: { latitude: 6.2196, longitude: -75.5906 } },
  { description: 'Terminal del Norte, Medellín', location: { latitude: 6.2750, longitude: -75.5703 } },
  { description: 'Terminal del Sur, Medellín', location: { latitude: 6.2163, longitude: -75.5833 } },
  { description: 'Estadio Atanasio Girardot', location: { latitude: 6.2567, longitude: -75.5909 } },
  // Centros Comerciales
  { description: 'Centro Comercial Santafé', location: { latitude: 6.2004, longitude: -75.5703 } },
  { description: 'Centro Comercial El Tesoro', location: { latitude: 6.1979, longitude: -75.5583 } },
  { description: 'Centro Comercial Viva Envigado', location: { latitude: 6.1764, longitude: -75.5915 } },
  { description: 'Telemedellín Canal Parque', location: { latitude: 6.2120, longitude: -75.5755 } }
];

export const LocationSearchBar = ({ type = 'origin', topOffset = 50 }) => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const isOrigin = type === 'origin';
  const accentColor = isOrigin ? '#000000' : '#276EF1';

  if (!isOrigin && !origin) return null;

  const handleTextChange = (text) => {
    setQuery(text);
    if (text.length > 1) {
      const filtered = MOCK_PLACES.filter(place =>
        place.description.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = (place) => {
    setQuery(place.description);
    setSuggestions([]);
    if (isOrigin) dispatch(setOrigin({ location: place.location, description: place.description }));
    else dispatch(setDestination({ location: place.location, description: place.description }));
  };

  return (
    <View style={[styles.container, { top: topOffset }]}>
      <View style={styles.inputRow}>
        <View style={[styles.dot, { backgroundColor: accentColor }]} />
        <TextInput
          style={styles.textInput}
          placeholder={isOrigin ? '📍 ¿Punto de partida?' : '🎯 ¿A dónde vas?'}
          placeholderTextColor="#777777"
          value={query}
          onChangeText={handleTextChange}
          autoCapitalize="none"
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.description}
          style={styles.listView}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectPlace(item)}>
              <View style={styles.suggestionDot} />
              <Text style={styles.suggestionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', width: '100%', paddingHorizontal: 16, zIndex: 10 },
  inputRow: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 1)', borderRadius: 15, paddingHorizontal: 15, height: 55, elevation: 0,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 15 },
  textInput: { flex: 1, fontSize: 16, color: '#000000', fontWeight: '500' },
  listView: { 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', marginTop: 8, borderRadius: 15, maxHeight: 200, 
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 1)', overflow: 'hidden'
  },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  suggestionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#AAAAAA', marginRight: 12 },
  suggestionText: { fontSize: 15, color: '#222222', fontWeight: '500' },
});