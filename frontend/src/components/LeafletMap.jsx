import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FaPhone, FaEnvelope, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour centrer la carte sur un marqueur
function MapController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

// Icône personnalisée pour les marqueurs
const createCustomIcon = (flag) => {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border: 3px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      ">
        ${flag}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const LeafletMap = () => {
  const [selectedOffice, setSelectedOffice] = useState(0);

  // Adresses FastCube
  const offices = [
    {
      id: 1,
      name: "Fastcube Paris",
      address: "8 rue des messageries, 75010 Paris, France",
      phone: "+33 7 44 09 04 94",
      email: "contact@fastcube.fr",
      coordinates: [48.8708, 2.3601],
      country: "France",
      flag: "🇫🇷"
    },
    {
      id: 2,
      name: "Fastcube Canada",
      address: "747 Rue du Square-Victoria, Montréal, Québec, Canada",
      phone: "+1 514 466 8023",
      email: "canada@fastcube.fr",
      coordinates: [45.5017, -73.5673],
      country: "Canada",
      flag: "🇨🇦"
    },
    {
      id: 3,
      name: "Fastcube Maroc",
      address: "Imm. Zénith 1, Lotiss. Attawfik, Casablanca 20100, Maroc",
      phone: "+212 6 61 11 52 10",
      email: "maroc@fastcube.fr",
      coordinates: [33.5731, -7.5898],
      country: "Maroc",
      flag: "🇲🇦"
    },
    {
      id: 4,
      name: "Fastcube Nantes",
      address: "14 Place Des Oiseaux, 85000 Mouilleron-le-captif, France",
      phone: "+33 6 85 59 96 68",
      email: "nantes@fastcube.fr",
      coordinates: [46.6034, 1.8883],
      country: "France",
      flag: "🇫🇷"
    }
  ];

  const centerOnOffice = (officeIndex) => {
    setSelectedOffice(officeIndex);
  };

  return (
    <div className="w-full">
      {/* En-tête de la section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm mb-6">
          🌍 Nos Implantations Mondiales
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
          Où Nous Trouver
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          FastCube est présent sur 3 continents avec 4 bureaux stratégiques pour vous accompagner au plus près
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des bureaux */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <FaBuilding className="w-6 h-6 text-blue-500" />
              Nos Bureaux
            </h3>
            
            <div className="space-y-4">
              {offices.map((office, index) => (
                <button
                  key={office.id}
                  onClick={() => centerOnOffice(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    selectedOffice === index
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{office.flag}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-2">{office.name}</h4>
                      <p className="text-sm mb-3 opacity-90">{office.address}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaPhone className="w-3 h-3" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="w-3 h-3" />
                          <span>{office.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Statistiques */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Bureaux</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Continents</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte Leaflet */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-gray-100/50 dark:border-gray-600/50">
            <div className="relative">
              <div 
                className="w-full h-96 lg:h-[500px] rounded-2xl shadow-lg overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                <MapContainer
                  center={offices[selectedOffice].coordinates}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                  scrollWheelZoom={true}
                >
                  <MapController 
                    center={offices[selectedOffice].coordinates} 
                    zoom={8} 
                  />
                  
                  {/* Tuiles de la carte */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Marqueurs pour chaque bureau */}
                  {offices.map((office, index) => (
                    <Marker
                      key={office.id}
                      position={office.coordinates}
                      icon={createCustomIcon(office.flag)}
                    >
                      <Popup>
                        <div className="p-4 min-w-[250px]">
                          <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-xl">{office.flag}</span>
                            {office.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">{office.address}</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FaPhone className="w-3 h-3 text-blue-500" />
                              <a href={`tel:${office.phone}`} className="hover:text-blue-600">
                                {office.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <FaEnvelope className="w-3 h-3 text-blue-500" />
                              <a href={`mailto:${office.email}`} className="hover:text-blue-600">
                                {office.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section contact rapide */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 shadow-xl border border-blue-100/50 dark:border-blue-800/50">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Besoin d'un rendez-vous ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Contactez directement le bureau le plus proche de vous
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {offices.map((office) => (
              <a
                key={office.id}
                href={`tel:${office.phone}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaPhone className="w-4 h-4" />
                <span>{office.country}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
