// src/lib/api/statisty/air.ts
import { apiCall, validateApiKey, createApiHeaders, airQualityRateLimiter } from './base';

export interface AirQualityData {
	aqi: number;
	co: number;
	no: number;
	no2: number;
	o3: number;
	so2: number;
	pm2_5: number;
	pm10: number;
	nh3: number;
}

export interface OpenWeatherAirResponse {
	coord: {
		lon: number;
		lat: number;
	};
	list: Array<{
		main: {
			aqi: number;
		};
		components: {
			co: number;
			no: number;
			no2: number;
			o3: number;
			so2: number;
			pm2_5: number;
			pm10: number;
			nh3: number;
		};
		dt: number;
	}>;
}

export interface WAQIResponse {
	status: string;
	data: {
		aqi: number;
		idx: number;
		attributions: Array<{
			url: string;
			name: string;
		}>;
		city: {
			geo: [number, number];
			name: string;
			url: string;
		};
		dominentpol: string;
		iaqi: {
			[key: string]: {
				v: number;
			};
		};
		time: {
			s: string;
			tz: string;
			v: number;
		};
	};
}

export async function getAirQualityOpenWeather(lat: number, lon: number): Promise<AirQualityData> {
	const apiKey = process.env.OPENWEATHER_API_KEY;
	validateApiKey('OpenWeatherMap', apiKey);

	await airQualityRateLimiter.waitForSlot();

	const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

	try {
		const response: OpenWeatherAirResponse = await apiCall(url);

		if (!response.list || response.list.length === 0) {
			throw new Error('No air quality data available for this location');
		}

		const current = response.list[0];

		return {
			aqi: current.main.aqi,
			co: current.components.co,
			no: current.components.no,
			no2: current.components.no2,
			o3: current.components.o3,
			so2: current.components.so2,
			pm2_5: current.components.pm2_5,
			pm10: current.components.pm10,
			nh3: current.components.nh3
		};
	} catch (error) {
		console.error('OpenWeather Air Quality API call failed:', error);
		throw error;
	}
}

export async function getAirQualityWAQI(lat: number, lon: number): Promise<AirQualityData> {
	const apiKey = process.env.WAQI_API_KEY;
	validateApiKey('WAQI', apiKey);

	const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey}`;

	try {
		const response: WAQIResponse = await apiCall(url);

		if (response.status !== 'ok') {
			throw new Error('WAQI API returned error status');
		}

		return {
			aqi: response.data.aqi,
			co: response.data.iaqi.co?.v || 0,
			no: response.data.iaqi.no?.v || 0,
			no2: response.data.iaqi.no2?.v || 0,
			o3: response.data.iaqi.o3?.v || 0,
			so2: response.data.iaqi.so2?.v || 0,
			pm2_5: response.data.iaqi.pm25?.v || 0,
			pm10: response.data.iaqi.pm10?.v || 0,
			nh3: response.data.iaqi.nh3?.v || 0
		};
	} catch (error) {
		console.error('WAQI API call failed:', error);
		throw error;
	}
}

// Free alternative using Open-Meteo (no API key required)
export async function getAirQualityOpenMeteo(
	lat: number,
	lon: number
): Promise<Partial<AirQualityData>> {
	const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

	try {
		const response = await apiCall<{
			current: {
				pm10: number;
				pm2_5: number;
				carbon_monoxide: number;
				nitrogen_dioxide: number;
				sulphur_dioxide: number;
				ozone: number;
			};
		}>(url);

		return {
			pm10: response.current.pm10,
			pm2_5: response.current.pm2_5,
			co: response.current.carbon_monoxide,
			no2: response.current.nitrogen_dioxide,
			so2: response.current.sulphur_dioxide,
			o3: response.current.ozone,
			aqi: calculateAQI(response.current.pm2_5) // Simplified AQI calculation
		};
	} catch (error) {
		console.error('Open-Meteo Air Quality API call failed:', error);
		throw error;
	}
}

// Primary function that tries multiple APIs
export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
	// Try Open-Meteo first (free, no API key required)
	try {
		const openMeteoData = await getAirQualityOpenMeteo(lat, lon);
		if (openMeteoData.aqi) {
			return openMeteoData as AirQualityData;
		}
	} catch (error) {
		console.warn('Open-Meteo failed, trying other APIs:', error);
	}

	// Try OpenWeatherMap if API key is available
	if (process.env.OPENWEATHER_API_KEY) {
		try {
			return await getAirQualityOpenWeather(lat, lon);
		} catch (error) {
			console.warn('OpenWeatherMap failed, trying WAQI:', error);
		}
	}

	// Try WAQI as fallback
	if (process.env.WAQI_API_KEY) {
		try {
			return await getAirQualityWAQI(lat, lon);
		} catch (error) {
			console.warn('WAQI failed:', error);
		}
	}

	throw new Error('All air quality APIs failed or no API keys configured');
}

// Utility functions
export function getAQICategory(aqi: number): string {
	if (aqi <= 50) return 'Good';
	if (aqi <= 100) return 'Moderate';
	if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
	if (aqi <= 200) return 'Unhealthy';
	if (aqi <= 300) return 'Very Unhealthy';
	return 'Hazardous';
}

export function getAQIColor(aqi: number): string {
	if (aqi <= 50) return '#00E400'; // Green - Good
	if (aqi <= 100) return '#FFFF00'; // Yellow - Moderate
	if (aqi <= 150) return '#FF7E00'; // Orange - Unhealthy for Sensitive Groups
	if (aqi <= 200) return '#FF0000'; // Red - Unhealthy
	if (aqi <= 300) return '#8F3F97'; // Purple - Very Unhealthy
	return '#7E0023'; // Maroon - Hazardous
}

export function getHealthRecommendation(aqi: number): string {
	if (aqi <= 50) {
		return 'Air quality is good. Great day for outdoor activities! 🌟';
	} else if (aqi <= 100) {
		return 'Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor activities.';
	} else if (aqi <= 150) {
		return 'Unhealthy for sensitive groups. Children, elderly, and people with respiratory conditions should limit outdoor activities.';
	} else if (aqi <= 200) {
		return 'Unhealthy air quality. Everyone should limit outdoor activities and consider wearing a mask if going outside.';
	} else if (aqi <= 300) {
		return 'Very unhealthy air quality. Avoid outdoor activities. Keep windows closed and use air purifiers if available.';
	} else {
		return 'Hazardous air quality! Stay indoors, avoid outdoor activities completely, and consider relocating temporarily if possible.';
	}
}

// Simplified AQI calculation based on PM2.5 (US EPA standard)
function calculateAQI(pm25: number): number {
	const breakpoints = [
		{ cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
		{ cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
		{ cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
		{ cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
		{ cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
		{ cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
		{ cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
	];

	for (const bp of breakpoints) {
		if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
			const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
			return Math.round(aqi);
		}
	}

	return 500; // Maximum AQI if above all breakpoints
}

export function getPollutantLevel(
	value: number,
	pollutant: string
): 'Low' | 'Moderate' | 'High' | 'Very High' {
	// Simplified pollutant level categorization
	const thresholds: Record<string, number[]> = {
		pm2_5: [12, 35, 55],
		pm10: [54, 154, 254],
		o3: [54, 70, 85],
		no2: [53, 100, 360],
		so2: [35, 75, 185],
		co: [4.4, 9.4, 12.4]
	};

	const levels = thresholds[pollutant] || [50, 100, 150];

	if (value <= levels[0]) return 'Low';
	if (value <= levels[1]) return 'Moderate';
	if (value <= levels[2]) return 'High';
	return 'Very High';
}
