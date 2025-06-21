// src/lib/stores/veggie.ts

import { writable, derived, get } from 'svelte/store';
import type { VeggieVenue, VeggieFilter, UserLocation, MapBounds } from '$lib/types/veggie.js';
import { VeggieAPI } from '$lib/api/veggie/index.js';

// Core stores
export const userLocation = writable<UserLocation | null>(null);
export const venues = writable<VeggieVenue[]>([]);
export const selectedVenue = writable<VeggieVenue | null>(null);
export const isLoading = writable(false);
export const mapBounds = writable<MapBounds | null>(null);

// Filter store with defaults
export const veggieFilter = writable<Partial<VeggieFilter>>({
  cuisine_types: [],
  vegetarian_types: [],
  min_rating: 0,
  max_distance: 10,
  dietary_requirements: [],
  open_now: false
});

// Location permission state
export const locationPermission = writable<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

// Search and filter state
export const searchQuery = writable('');
export const showFilters = writable(false);

// Filtered venues derived store
export const filteredVenues = derived(
  [venues, veggieFilter, userLocation, searchQuery],
  ([$venues, $filter, $userLocation, $searchQuery]) => {
    let filtered = $venues;

    // Apply search query
    if ($searchQuery.trim()) {
      const query = $searchQuery.toLowerCase();
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(query) ||
        venue.cuisine_type.toLowerCase().includes(query) ||
        venue.address.toLowerCase().includes(query) ||
        venue.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    filtered = VeggieAPI.filterVenues(filtered, $filter, $userLocation || undefined);

    // Sort by distance if user location is available
    if ($userLocation) {
      filtered.sort((a, b) => {
        const distanceA = VeggieAPI.calculateDistance(
          $userLocation.latitude,
          $userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distanceB = VeggieAPI.calculateDistance(
          $userLocation.latitude,
          $userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distanceA - distanceB;
      });
    }

    return filtered;
  }
);

// Statistics derived store
export const veggieStats = derived(
  [venues, userLocation],
  ([$venues, $userLocation]) => {
    const stats = {
      totalVenues: $venues.length,
      fullyVeg: $venues.filter(v => v.vegetarian_type === 'fully_veg').length,
      vegFriendly: $venues.filter(v => v.vegetarian_type === 'veg_friendly').length,
      veganOnly: $venues.filter(v => v.vegetarian_type === 'vegan_only').length,
      verified: $venues.filter(v => v.verified).length,
      averageRating: $venues.length > 0 
        ? $venues.reduce((sum, v) => sum + v.rating, 0) / $venues.length 
        : 0,
      nearbyVenues: 0
    };

    if ($userLocation) {
      stats.nearbyVenues = $venues.filter(venue => 
        VeggieAPI.calculateDistance(
          $userLocation.latitude,
          $userLocation.longitude,
          venue.latitude,
          venue.longitude
        ) <= 5 // Within 5km
      ).length;
    }

    return stats;
  }
);

// Actions
export const veggieActions = {
  // Initialize user location
  async initializeLocation(): Promise<boolean> {
    isLoading.set(true);
    try {
      if (!navigator.geolocation) {
        locationPermission.set('denied');
        return false;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const location: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      userLocation.set(location);
      locationPermission.set('granted');
      
      // Set initial map bounds
      const bounds = VeggieAPI.getBounds(location, 5);
      mapBounds.set(bounds);
      
      return true;
    } catch (error) {
      console.error('Error getting location:', error);
      locationPermission.set('denied');
      return false;
    } finally {
      isLoading.set(false);
    }
  },

  // Set location manually (e.g., from search)
  async setLocation(latitude: number, longitude: number): Promise<void> {
    const location: UserLocation = { latitude, longitude };
    userLocation.set(location);
    
    const bounds = VeggieAPI.getBounds(location, 5);
    mapBounds.set(bounds);
    
    await this.fetchVenues();
  },

  // Fetch venues in current bounds
  async fetchVenues(): Promise<void> {
    const currentBounds = get(mapBounds);
    if (!currentBounds) return;

    isLoading.set(true);
    try {
      // Fetch from OSM
      const osmVenues = await VeggieAPI.fetchOSMVenues(currentBounds);
      
      // Convert to VeggieVenue format
      const convertedVenues: VeggieVenue[] = osmVenues.map((osmVenue, index) => ({
        id: `osm-${osmVenue.id}`,
        ...VeggieAPI.osmToVeggieVenue(osmVenue),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system'
      } as VeggieVenue));

      venues.set(convertedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      isLoading.set(false);
    }
  },

  // Update map bounds and fetch venues
  async updateBounds(bounds: MapBounds): Promise<void> {
    mapBounds.set(bounds);
    await this.fetchVenues();
  },

  // Search by address
  async searchByAddress(address: string): Promise<boolean> {
    isLoading.set(true);
    try {
      const location = await VeggieAPI.geocodeAddress(address);
      if (location) {
        await this.setLocation(location.latitude, location.longitude);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error searching by address:', error);
      return false;
    } finally {
      isLoading.set(false);
    }
  },

  // Toggle filter visibility
  toggleFilters(): void {
    showFilters.update(show => !show);
  },

  // Update filter
  updateFilter(updates: Partial<VeggieFilter>): void {
    veggieFilter.update(current => ({ ...current, ...updates }));
  },

  // Clear filters
  clearFilters(): void {
    veggieFilter.set({
      cuisine_types: [],
      vegetarian_types: [],
      min_rating: 0,
      max_distance: 10,
      dietary_requirements: [],
      open_now: false
    });
  },

  // Select venue
  selectVenue(venue: VeggieVenue | null): void {
    selectedVenue.set(venue);
  }
};