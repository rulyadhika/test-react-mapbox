import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
  ScaleControl,
  Popup,
  Layer,
  Source,
} from "react-map-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

import cities from "../data/cities.json";

import { Pin } from "./components";
import { useState, useCallback, useEffect } from "react";

const capitalCitylayerStyle = {
  id: "capitalCityLayer",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "blue",
  },
};
const ordinaryCityLayerStyle = {
  id: "ordinaryCityLayer",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "red",
  },
};

const App = () => {
  const [popupInfo, setPopupInfo] = useState(null);

  const onHover = useCallback((event) => {
    const { features } = event;

    const hoveredFeature = features && features[0];
    setPopupInfo(hoveredFeature && { ...hoveredFeature.properties });
  }, []);

  const [geojson, setGeojson] = useState({});

  const [layerVisibility, setLayerVisibility] = useState({
    ordinaryCity: true,
    capitalCity: true,
  });

  useEffect(() => {
    let tempOrdinaryCity = [];
    let tempCapitalCity = [];

    cities.forEach((city, index) => {
      let data = {
        id: index,
        properties: {
          name: city.city,
          population: city.population,
          image: city.image,
          state: city.state,
          longitude: city.longitude,
          latitude: city.latitude,
          type: city.type,
        },
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [city.longitude, city.latitude],
        },
      };

      if (city.type === "capitalCity") {
        tempCapitalCity.push(data);
      } else {
        tempOrdinaryCity.push(data);
      }
    });

    setGeojson({
      ordinaryCity: {
        type: "FeatureCollection",
        features: tempOrdinaryCity,
      },
      capitalCity: { type: "FeatureCollection", features: tempCapitalCity },
    });
  }, []);

  return (
    <>
      <Map
        interactiveLayerIds={["ordinaryCityLayer", "capitalCityLayer"]}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        onMouseMove={onHover}
        style={{ width: "100vw", height: "90vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoiZGVzYWtlbmRhbCIsImEiOiJja3ZrcjZvcGEwZGxkMnZ1cG5vMDQwOXZ2In0.FwrDaW7bCVxk0x_I8VXSUQ">
        <Source
          id="ordinaryCityData"
          type="geojson"
          data={geojson.ordinaryCity}>
          <Layer
            {...ordinaryCityLayerStyle}
            layout={{ visibility: layerVisibility.ordinaryCity?'visible' : 'none' }}
          />
        </Source>
        <Source id="capitalCityData" type="geojson" data={geojson.capitalCity}>
          <Layer
            {...capitalCitylayerStyle}
            layout={{ visibility: layerVisibility.capitalCity?'visible' : 'none' }}
          />
        </Source>
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {/* {cities.map((city, index) => (
          <Marker
            color="red"
            key={`city_${index}`}
            longitude={city.longitude}
            latitude={city.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(city);
            }}
          />
          <Marker
            key={`city_${index}`}
            longitude={city.longitude}
            latitude={city.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(city);
            }}>
            <Pin />
          </Marker>
        ))} */}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}>
            <div>
              {popupInfo.name}, {popupInfo.state} |{" "}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}>
                Wikipedia
              </a>
            </div>
            <span>Population : {popupInfo.population} | </span>
            <span>Type : {popupInfo.type}</span>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>

      <div style={{ display: "block" }}>
        <label htmlFor="ordinaryCityCheckBox">Ordinary City</label>
        <input
          checked={layerVisibility.ordinaryCity}
          id="ordinaryCityCheckBox"
          type="checkbox"
          onChange={() =>
            setLayerVisibility((prev) => ({
              ...prev,
              ordinaryCity: !prev.ordinaryCity,
            }))
          }
        />
      </div>
      <div style={{ display: "block" }}>
        <label htmlFor="capitalCityCheckBox">Capital City</label>
        <input
          checked={layerVisibility.capitalCity}
          id="capitalCityCheckBox"
          type="checkbox"
          onChange={() =>
            setLayerVisibility((prev) => ({
              ...prev,
              capitalCity: !prev.capitalCity,
            }))
          }
        />
      </div>
    </>
  );
};

export default App;
