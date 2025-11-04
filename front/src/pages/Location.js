import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CustomMarker } from "../components/CustomMarker";

const { BaseLayer } = LayersControl;

function Location() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  console.log("Latitude:", lat);
  console.log("Longitude:", lng);

  return (
    <div>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Street View">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>

          <BaseLayer name="Terrain">
            <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
          </BaseLayer>

          <BaseLayer name="Dark Mode">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </BaseLayer>
        </LayersControl>
        <Marker position={[lat, lng]} icon={CustomMarker}></Marker>

        {/* {userLat && userLng && (
          <Routing
            userLat={userLat}
            userLng={userLng}
            storeLat={storeLat}
            storeLng={storeLng}
          />
        )} */}
      </MapContainer>
    </div>
  );
}

export default Location;
