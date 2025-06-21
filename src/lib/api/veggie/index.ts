// src/lib/api/veggie/index.ts

import type {
	VeggieVenue,
	VeggieDish,
	VeggieReview,
	VeggieFilter,
	OSMVenue,
	UserLocation,
	MapBounds
} from '$lib/types/veggie.d.ts';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';

export class VeggieAPI {
	/**
	 * Fetch vegetarian venues from OpenStreetMap via Overpass API
	 */
	static async fetchOSMVenues(bounds: MapBounds): Promise<OSMVenue[]> {
		const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]["diet:vegetarian"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]["diet:vegan"="yes"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]["cuisine"="vegetarian"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]["cuisine"="vegan"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      );
      out meta;
    `;

		try {
			const response = await fetch(OVERPASS_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: `data=${encodeURIComponent(query)}`
			});

			if (!response.ok) {
				throw new Error(`Overpass API error: ${response.status}`);
			}

			const data = await response.json();

			return (
				data.elements?.map((element: any) => ({
					id: element.id.toString(),
					lat: element.lat,
					lon: element.lon,
					tags: element.tags || {}
				})) || []
			);
		} catch (error) {
			console.error('Error fetching OSM venues:', error);
			return [];
		}
	}

	/**
	 * Geocode an address using Nominatim
	 */
	static async geocodeAddress(address: string): Promise<UserLocation | null> {
		try {
			const response = await fetch(
				`${NOMINATIM_API_URL}/search?format=json&limit=1&q=${encodeURIComponent(address)}`
			);

			if (!response.ok) {
				throw new Error(`Nominatim error: ${response.status}`);
			}

			const data = await response.json();

			if (data.length === 0) {
				return null;
			}

			return {
				latitude: parseFloat(data[0].lat),
				longitude: parseFloat(data[0].lon)
			};
		} catch (error) {
			console.error('Error geocoding address:', error);
			return null;
		}
	}

	/**
	 * Reverse geocode coordinates to get address
	 */
	static async reverseGeocode(lat: number, lon: number): Promise<string> {
		try {
			const response = await fetch(
				`${NOMINATIM_API_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
			);

			if (!response.ok) {
				throw new Error(`Nominatim error: ${response.status}`);
			}

			const data = await response.json();
			return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
		} catch (error) {
			console.error('Error reverse geocoding:', error);
			return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
		}
	}

	/**
	 * Convert OSM venue to VeggieVenue format
	 */
	static osmToVeggieVenue(osmVenue: OSMVenue): Partial<VeggieVenue> {
		const tags = osmVenue.tags;

		// Determine vegetarian type
		let vegetarian_type: 'fully_veg' | 'veg_friendly' | 'vegan_only' = 'veg_friendly';

		if (tags['diet:vegan'] === 'yes' || tags.cuisine === 'vegan') {
			vegetarian_type = 'vegan_only';
		} else if (tags.cuisine === 'vegetarian' || tags['diet:vegetarian'] === 'only') {
			vegetarian_type = 'fully_veg';
		}

		// Build address
		const addressParts = [tags.addr_housenumber, tags.addr_street, tags.addr_city].filter(Boolean);

		return {
			name: tags.name || 'Unnamed Venue',
			address: addressParts.join(', ') || 'Address not available',
			latitude: osmVenue.lat,
			longitude: osmVenue.lon,
			cuisine_type: tags.cuisine || 'unknown',
			vegetarian_type,
			phone: tags.phone,
			website: tags.website,
			opening_hours: tags.opening_hours,
			rating: 0,
			review_count: 0,
			photos: [],
			verified: false,
			tags: Object.keys(tags).filter((key) => key.startsWith('cuisine') || key.startsWith('diet')),
			description: `${tags.amenity} serving ${vegetarian_type.replace('_', ' ')} options`
		};
	}

	/**
	 * Calculate distance between two points using Haversine formula
	 */
	static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371; // Earth's radius in kilometers
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	/**
	 * Get map bounds for a given center point and radius
	 */
	static getBounds(center: UserLocation, radiusKm: number = 5): MapBounds {
		const latOffset = radiusKm / 111; // Approximate km per degree latitude
		const lonOffset = radiusKm / (111 * Math.cos((center.latitude * Math.PI) / 180));

		return {
			north: center.latitude + latOffset,
			south: center.latitude - latOffset,
			east: center.longitude + lonOffset,
			west: center.longitude - lonOffset
		};
	}

	/**
	 * Filter venues based on criteria
	 */
	static filterVenues(
		venues: VeggieVenue[],
		filter: Partial<VeggieFilter>,
		userLocation?: UserLocation
	): VeggieVenue[] {
		return venues.filter((venue) => {
			// Cuisine filter
			if (filter.cuisine_types?.length && !filter.cuisine_types.includes(venue.cuisine_type)) {
				return false;
			}

			// Vegetarian type filter
			if (
				filter.vegetarian_types?.length &&
				!filter.vegetarian_types.includes(venue.vegetarian_type)
			) {
				return false;
			}

			// Rating filter
			if (filter.min_rating && venue.rating < filter.min_rating) {
				return false;
			}

			// Distance filter
			if (filter.max_distance && userLocation) {
				const distance = this.calculateDistance(
					userLocation.latitude,
					userLocation.longitude,
					venue.latitude,
					venue.longitude
				);
				if (distance > filter.max_distance) {
					return false;
				}
			}

			return true;
		});
	}
}
