import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapWithMarkers = ({ markersData }) => {
  return (
    <MapContainer center={[45.52700549400805, -73.60502078184405]} zoom={13} style={{ height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Array.isArray(markersData) && markersData.map(marker => (
        <Marker key={marker._id} position={[marker.Latitude, marker.Longitude]}>
          <Popup>
            <strong>{marker.Nom}</strong>
            <br />
            {marker.ID}
            <br />
            {/* Afficher le nombre total de passages */}
            Total de passages : {marker.totalPassages}
            <br />
            Status : {marker.Statut}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithMarkers;
