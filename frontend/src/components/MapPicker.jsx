import { useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MapPicker = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBFEPJo8nu6g6LTHxFZMgLn_fqN6jmXgHI" // Replace with your API key
  });

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setSelectedLocation(newLocation);
    onSelectLocation(newLocation);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };



  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: 0, lng: 0 }}
      zoom={2}
      onClick={handleMapClick}
    >
      {selectedLocation && (
        <Marker
          position={selectedLocation}
        />
      )}
    </GoogleMap>
  ) : <div>Loading...</div>;
};

MapPicker.propTypes = {
  onSelectLocation: PropTypes.func.isRequired,
};

export default MapPicker;
