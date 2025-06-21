// src/lib/types/veggie.d.ts

export interface VeggieVenue {
	id: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	cuisine_type: string;
	vegetarian_type: 'fully_veg' | 'veg_friendly' | 'vegan_only';
	phone?: string;
	website?: string;
	opening_hours?: string;
	rating: number;
	review_count: number;
	photos: string[];
	verified: boolean;
	created_at: string;
	updated_at: string;
	created_by: string;
	tags: string[];
	description?: string;
}

export interface VeggieDish {
	id: string;
	venue_id: string;
	name: string;
	description?: string;
	price?: number;
	currency?: string;
	category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'side';
	dietary_tags: ('vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free')[];
	photo?: string;
	rating: number;
	review_count: number;
	created_at: string;
	created_by: string;
}

export interface VeggieReview {
	id: string;
	venue_id: string;
	dish_id?: string;
	user_id: string;
	rating: number;
	comment?: string;
	photos: string[];
	helpful_count: number;
	created_at: string;
	updated_at: string;
}

export interface VeggieFilter {
	cuisine_types: string[];
	vegetarian_types: ('fully_veg' | 'veg_friendly' | 'vegan_only')[];
	min_rating: number;
	max_distance: number; // in km
	price_range?: 'budget' | 'mid' | 'premium';
	dietary_requirements: string[];
	open_now: boolean;
}

export interface MapBounds {
	north: number;
	south: number;
	east: number;
	west: number;
}

export interface UserLocation {
	latitude: number;
	longitude: number;
	accuracy?: number;
}

export interface VeggieContribution {
	id: string;
	user_id: string;
	type: 'venue' | 'dish' | 'review' | 'photo';
	points: number;
	created_at: string;
}

export interface OSMVenue {
	id: string;
	lat: number;
	lon: number;
	tags: {
		name?: string;
		amenity?: string;
		cuisine?: string;
		'diet:vegetarian'?: string;
		'diet:vegan'?: string;
		phone?: string;
		website?: string;
		opening_hours?: string;
		addr_housenumber?: string;
		addr_street?: string;
		addr_city?: string;
	};
}
