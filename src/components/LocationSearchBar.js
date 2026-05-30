import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setOrigin, setDestination } from '../store/navSlice';

// INSERT YOUR ACTUAL API KEY HERE
const GOOGLE_MAPS_API_KEY = "AIzaSyCV20t3wxIbdLwTc0TTGJ3vwxvT57sDX5w"; 

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
