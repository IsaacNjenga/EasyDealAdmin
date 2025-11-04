import L from "leaflet";
import markerIcon from "../assets/icons/pin.png"; // your own image

export const CustomMarker = L.icon({
  iconUrl: markerIcon,
  iconSize: [40, 40], // width, height in px
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -35], // position of popup relative to the icon
});
