// src/lib/api/statisty/carbon.ts
export interface CarbonFootprintData {
	transport: number;
	energy: number;
	food: number;
	total: number;
}

export function calculateTransportEmissions(
	distance: number,
	mode: 'car' | 'bus' | 'train'
): number {
	const emissionFactors = {
		car: 0.21, // kg CO2 per km
		bus: 0.08,
		train: 0.04
	};
	return distance * emissionFactors[mode];
}
