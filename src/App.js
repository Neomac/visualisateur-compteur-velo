import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Assurez-vous d'importer les styles Leaflet
import MapWithMarkers from './MapWithMarkers';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const App = () => {
  const [stopsData, setStopsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état isLoading


  //Setup map Leaflet
  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);

  useEffect(() => {
    const stopsApiUrl = 'https://donnees.montreal.ca/api/3/action/datastore_search';
    const stopsResource_id = 'c7d0546a-a218-479e-bc9f-ce8f13ca972c'; // Remplacez par le bon ID de la ressource

    axios.get(stopsApiUrl, {
      params: {
        resource_id: stopsResource_id,
      },
    })
    .then(response => {
      const records = response.data.result.records;
      setStopsData(records);
      
      // Récupérer tous les enregistrements de passages en paginant
      const fetchAllPassages = async () => {
        let allPassages = [];
        let offset = 0;
        const batchSize = 31000;

        while (true) {
          const passagesApiUrl = 'https://donnees.montreal.ca/api/3/action/datastore_search_sql';
          const passagesSql = `SELECT nb_passages, id_compteur, date FROM "65a37da8-a7cf-4812-a3b5-5edff31c45f6" WHERE date >= '2023-01-01' AND date <= '2023-07-31' OFFSET ${offset} LIMIT ${batchSize}`;
          
          const passagesResponse = await axios.get(passagesApiUrl, {
            params: {
              sql: passagesSql,
            },
          });
          
          const passagesRecords = passagesResponse.data.result.records;

          if (passagesRecords.length === 0) {
            break;
          }

          allPassages = allPassages.concat(passagesRecords);
          offset += batchSize;
        }

        return allPassages;
      };

      fetchAllPassages()
        .then(allPassages => {
          // Calculer le nombre total de passages en 2023 pour chaque arrêt
          const stopsWithPassages = records.map(stop => {
            const idCompteur = stop.ID;
            const filteredPassages = allPassages
              .filter(record => record.id_compteur === idCompteur);
            
            const totalPassages = filteredPassages.reduce((total, record) => {
              const nbPassages = parseInt(record.nb_passages, 10);
              return isNaN(nbPassages) ? total : total + nbPassages;
            }, 0);


            setIsLoading(false); // Marquer le chargement comme terminé
            return { ...stop, totalPassages };
          });

          setStopsData(stopsWithPassages);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données des passages :', error);
          setIsLoading(false); // Marquer le chargement comme terminé en cas d'erreur
        });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données des arrêts :', error);
      setIsLoading(false); // Marquer le chargement comme terminé en cas d'erreur
    });
  }, []);

  console.log(stopsData);

  return (
    <div>
      <h1>Carte des arrêts avec les passages</h1>
      {isLoading ? ( // Afficher l'écran de chargement si isLoading est vrai
        <div>Loading...</div>
      ) : (
        <MapWithMarkers markersData={stopsData} />
      )}
    </div>
  );
};

export default App;
