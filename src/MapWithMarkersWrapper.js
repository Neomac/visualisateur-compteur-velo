import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapWithMarkers from './MapWithMarkers';

const MapWithMarkersWrapper = () => {
  const [markersData, setMarkersData] = useState([]);
  const startDate = new Date('2023-01-01'); // Exemple de date de début au format ISO 8601 (AAAA-MM-JJ)
  const endDate = new Date('2023-07-31');   // Exemple de date de fin au format ISO 8601

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

  // Fonction pour mettre à jour les marqueurs avec le nombre total de passages
  const updateMarkersWithTotalPassages = async () => {
    if (Array.isArray(markersData)) {
      const updatedMarkersData = await Promise.all(
        markersData.map(async (marker) => {
          const totalNbPassage = await getTotalPassagesForIdAndPeriod(marker._id, startDate, endDate);
          return { ...marker, totalNbPassage };
        })
      );

      setMarkersData(updatedMarkersData);
    }
  };

  // Fonction pour récupérer le nombre total de passage pour un ID donné
  const getTotalNbPassageById = async (id) => {
    try {
      console.log("Test");
      // Remplacez l'URL ci-dessous par l'API ou l'endpoint qui renvoie les données de la propriété nb_passage pour l'ID donné.ß
      const apiUrl = `https://donnees.montreal.ca/api/3/action/datastore_search_sql?sql=SELECT nb_passages FROM "65a37da8-a7cf-4812-a3b5-5edff31c45f6" WHERE id_compteur=${id}`;
      const response = await axios.get(apiUrl);

      // Filtrer les enregistrements ayant la valeur null dans la propriété nb_passage
      const filteredData = response.data.result.records.filter(item => item.nb_passages !== null);

      // Convertir les valeurs restantes en nombre et effectuer la somme
      const nbPassageArray = filteredData.map(item => parseInt(item.nb_passages, 10));
      const totalNbPassage = nbPassageArray.reduce((acc, curr) => acc + curr, 0);

      return totalNbPassage;
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      return 0;
    }
  };

  const getTotalPassagesForIdAndPeriod = async (idCompteur, startDate, endDate) => {
  try {

    console.log("Teat")
    const apiUrl = `https://donnees.montreal.ca/api/3/action/datastore_search_sql?sql=SELECT nb_passages, date FROM "65a37da8-a7cf-4812-a3b5-5edff31c45f6" WHERE _id='${idCompteur}'`;

    const response = await axios.get(apiUrl);
    const records = response.data.result.records;

    const totalPassages = records.reduce((total, record) => {
      const nbPassages = parseInt(record.nb_passages, 10);

      // Convertir la date stockée en texte en objet Date pour la comparer
      const recordDate = new Date(record.date);
      
      if (recordDate >= startDate && recordDate <= endDate) {
        return total + nbPassages;
      }
      
      return total;
    }, 0);

    return totalPassages;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    return 0;
  }
};



  useEffect(() => {
    // Appeler updateMarkersWithTotalPassages pour mettre à jour les marqueurs une seule fois au montage initial du composant
    updateMarkersWithTotalPassages();
  }, []);

  return <MapWithMarkers markersData={markersData} />;
};

export default MapWithMarkersWrapper;
