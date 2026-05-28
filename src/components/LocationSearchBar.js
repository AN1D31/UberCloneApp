import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setOrigin, setDestination } from '../store/navSlice';


const GOOGLE_MAPS_API_KEY = "AIzaSyCV20t3wxIbdLwTc0TTGJ3vwxvT57sDX5w"; 

export const LocationSearchBar = ({ type = 'origin' }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={type === 'origin' ? "Where from?" : "Where to?"}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const locationData = {
              location: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
              description: data.description,
            };

            if (type === 'origin') {
              dispatch(setOrigin(locationData));
            } else {
              dispatch(setDestination(locationData));
            }
          }
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.autocompleteContainer,
          listView: styles.listView,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  textInput: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  autocompleteContainer: {
    flex: 0,
  },
  listView: {
    backgroundColor: '#FFFFFF',
    marginTop: 5,
    borderRadius: 8,
    elevation: 5,
  }
});
