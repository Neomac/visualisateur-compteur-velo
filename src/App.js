/* eslint-env jquery */

import logo from './logo.svg';
import './App.css';

import * as React from "react";
import { Map, Marker, Popup, TileLayer, MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios, {isCancel, AxiosError} from 'axios';
import MapWithMarkersWrapper from './MapWithMarkersWrapper'

function App() {
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


  // //Get de la liste des compteurs vélos
  // axios.get('https://donnees.montreal.ca/api/3/action/datastore_search', {
  //     params: {
  //       resource_id: 'c7d0546a-a218-479e-bc9f-ce8f13ca972c',
  //     }
  //   })
  //   .then(function (response) {
  //     //Récup de la liste des compteurs
  //     listCompteur = response.data.result.records;

  //     //Affichage des points 


  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   })
  //   .finally(function () {
  //     // always executed
  //   });


  //Get des données de comptage
  // axios.get('https://donnees.montreal.ca/api/3/action/datastore_search', {
  //     params: {
  //       resource_id: '65a37da8-a7cf-4812-a3b5-5edff31c45f6',
  //       limit: 5,
  //     }
  //   })
  //   .then(function (response) {
  //     console.log(response);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   })
  //   .finally(function () {
  //     // always executed
  //   });


  // axios.get('https://donnees.montreal.ca/api/3/action/datastore_search_sql?sql=SELECT nb_passages from "65a37da8-a7cf-4812-a3b5-5edff31c45f6" WHERE _id = 100011783')
  //         .then(response => {
  //           console.log(response.data);
  //         })
  //         .catch(error => {
  //           console.error('Erreur lors de la récupération des données des marqueurs :', error);
  //         });

    return (
      <div>
        <h1>Visualisateur compteur vélo</h1>
        <MapWithMarkersWrapper /> {/* Utilisation du composant MapWithMarkers ici */}
      </div>
    );
}

export default App;
