import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapWithMarkers = () => {
  const [markersData, setMarkersData] = useState([]);

  useEffect(() => {
    // Remplacez l'URL ci-dessous par l'API que vous souhaitez utiliser pour récupérer les données des marqueurs.
    const apiUrl = 'https://donnees.montreal.ca/api/3/action/datastore_search';

    axios.get(apiUrl, {
        params: {
          resource_id: 'c7d0546a-a218-479e-bc9f-ce8f13ca972c',
        }    
      })
      .then(response => {
        setMarkersData(response.data.result.records);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données des marqueurs :', error);
      });
  }, []);

    // Fonction pour récupérer le nombre total de passage pour un ID donné
  const getTotalNbPassageById = async (id) => {
    try {
      // Remplacez l'URL ci-dessous par l'API ou l'endpoint qui renvoie les données de la propriété nb_passage pour l'ID donné.
      const apiUrl = `https://donnees.montreal.ca/api/3/action/datastore_search_sql?sql=SELECT nb_passages from "65a37da8-a7cf-4812-a3b5-5edff31c45f6" WHERE _id=${id}`;
      const response = await axios.get(apiUrl);
      
      // Filtrer les enregistrements ayant la valeur null dans la propriété nb_passage
      const filteredData = response.data.result.records.filter(item => item.nb_passages !== null);

      const nbPassageArray = filteredData.map(item => parseInt(item.nb_passages, 10));
      const totalNbPassage = nbPassageArray.reduce((acc, curr) => acc + curr, 0);
      
      console.log(totalNbPassage);

      return totalNbPassage;
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      return 0;
    }
  };


  useEffect(() => {
    // Appeler getTotalNbPassageById pour chaque marqueur et mettre à jour les données du marqueur avec le nombre total de passages
    const updateMarkersWithTotalPassages = async () => {
      const updatedMarkersData = await Promise.all(
        markersData.map(async (marker) => {
          const totalNbPassage = await getTotalNbPassageById(marker.ID);
          return { ...marker, totalNbPassage };
        })
      );

      setMarkersData(updatedMarkersData);
    };

    if (Array.isArray(markersData)) {
      updateMarkersWithTotalPassages();
    }
  }, [markersData]);

	// Vérifier si markersData est un tableau avant de l'utiliser avec map
	if (!Array.isArray(markersData)) {
		console.log("Test");
		console.log("markersData : " + JSON.stringify(markersData));
		return "<div>Chargement en cours...</div>";
	}

  return (
    <MapContainer center={[45.52700549400805, -73.60502078184405]} zoom={13} style={{ height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markersData.map(marker => (
        <Marker key={marker.ID} position={[marker.Latitude, marker.Longitude]}>
          <Popup>
            <strong>{marker.Nom}</strong>
            <br />
            {marker._id}
            <br />
            {/* Appeler getTotalNbPassageById pour chaque marqueur */}
            Total de passages : {marker.totalNbPassage}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const MapWithMarkersWrapper = () => {
  // Utilisation d'un autre useEffect avec un tableau de dépendances vide pour exécuter la mise à jour des marqueurs une seule fois au montage initial du composant
  useEffect(() => {
    updateMarkersWithTotalPassages();
  }, []);

  // Fonction pour mettre à jour les marqueurs avec le nombre total de passages
  const updateMarkersWithTotalPassages = async () => {
    if (Array.isArray(markersData)) {
      const updatedMarkersData = await Promise.all(
        markersData.map(async (marker) => {
          const totalNbPassage = await getTotalNbPassageById(marker._id);
          return { ...marker, totalNbPassage };
        })
      );

      setMarkersData(updatedMarkersData);
    }
  };

  return <MapWithMarkers />;
};

export default MapWithMarkersWrapper;
