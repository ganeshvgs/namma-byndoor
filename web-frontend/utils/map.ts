import { PlaceDetails } from "../types/place";

export function getMapUrl(place: PlaceDetails): string | null {
  if (place.googleMapsUrl && place.googleMapsUrl.trim() !== "") {
    return place.googleMapsUrl;
  }
  if (
    place.latitude !== undefined &&
    place.longitude !== undefined &&
    !isNaN(Number(place.latitude)) &&
    !isNaN(Number(place.longitude))
  ) {
    return `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
  }
  return null;
}