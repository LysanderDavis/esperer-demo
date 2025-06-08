// src/lib/api/statisty/carbon.ts
export interface CarbonFootprintData {
	transport: number;
	energy: number;
	food: number;
	total: number;
	category: string;
	date: string;
}

export interface CarbonInputs {
	carKm: number;
	publicTransportKm: number;
	bikeKm: number;
	walkKm: number;
	electricityKwh: number;
	gasUsage: number;
	heatingUsage: number;
	meatServings: number;
	dairyServings: number;
	vegetableServings: number;
	fishServings: number;
}

export interface CarbonTip {
	icon: string;
	title: string;
	description: string;
	impact: string;
}

// Enhanced carbon factors (kg CO2 per unit)
export const carbonFactors = {
	transport: {
		car: 0.21, // per km
		bus: 0.08,
		train: 0.04,
		plane: 0.25,
		bike: 0,
		walk: 0,
		motorcycle: 0.15,
		taxi: 0.19
	},
	energy: {
		electricity: 0.5, // per kWh
		gas: 2.3, // per cubic meter
		heating: 0.3,
		cooling: 0.4
	},
	food: {
		meat: 3.3, // per serving
		dairy: 1.9,
		vegetables: 0.4,
		grains: 0.9,
		fish: 2.1,
		processed: 1.5
	}
};

// Carbon reduction tips
export const carbonTips: CarbonTip[] = [
	{
		icon: '🚌',
		title: 'Use Public Transport',
		description: 'Switch from car to bus/train for daily commutes',
		impact: 'Save up to 2.3 kg CO₂ per day'
	},
	{
		icon: '🚴',
		title: 'Bike or Walk',
		description: 'Choose active transport for short distances',
		impact: 'Zero emissions + health benefits'
	},
	{
		icon: '💡',
		title: 'Energy Efficiency',
		description: 'Use LED bulbs and unplug devices when not in use',
		impact: 'Reduce energy footprint by 20%'
	},
	{
		icon: '🥬',
		title: 'Plant-Based Meals',
		description: 'Reduce meat consumption and eat more vegetables',
		impact: 'Save 2.9 kg CO₂ per meat-free day'
	},
	{
		icon: '🏠',
		title: 'Improve Insulation',
		description: 'Better home insulation reduces heating/cooling needs',
		impact: 'Cut energy use by 30%'
	},
	{
		icon: '♻️',
		title: 'Reduce, Reuse, Recycle',
		description: 'Minimize waste and choose sustainable products',
		impact: 'Lower overall carbon footprint'
	}
];

export function calculateTransportEmissions(
	inputs: Pick<CarbonInputs, 'carKm' | 'publicTransportKm' | 'bikeKm' | 'walkKm'>
): number {
	const { carKm, publicTransportKm, bikeKm, walkKm } = inputs;

	return (
		carKm * carbonFactors.transport.car +
		publicTransportKm * carbonFactors.transport.bus +
		bikeKm * carbonFactors.transport.bike +
		walkKm * carbonFactors.transport.walk
	);
}

export function calculateEnergyEmissions(
	inputs: Pick<CarbonInputs, 'electricityKwh' | 'gasUsage' | 'heatingUsage'>
): number {
	const { electricityKwh, gasUsage, heatingUsage } = inputs;

	return (
		electricityKwh * carbonFactors.energy.electricity +
		gasUsage * carbonFactors.energy.gas +
		heatingUsage * carbonFactors.energy.heating
	);
}

export function calculateFoodEmissions(
	inputs: Pick<
		CarbonInputs,
		'meatServings' | 'dairyServings' | 'vegetableServings' | 'fishServings'
	>
): number {
	const { meatServings, dairyServings, vegetableServings, fishServings } = inputs;

	return (
		meatServings * carbonFactors.food.meat +
		dairyServings * carbonFactors.food.dairy +
		vegetableServings * carbonFactors.food.vegetables +
		fishServings * carbonFactors.food.fish
	);
}

export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonFootprintData {
	const transport = calculateTransportEmissions(inputs);
	const energy = calculateEnergyEmissions(inputs);
	const food = calculateFoodEmissions(inputs);
	const total = transport + energy + food;

	let category = '';
	if (total < 5) category = 'Low Impact';
	else if (total < 15) category = 'Moderate Impact';
	else if (total < 30) category = 'High Impact';
	else category = 'Very High Impact';

	return {
		transport: Math.round(transport * 100) / 100,
		energy: Math.round(energy * 100) / 100,
		food: Math.round(food * 100) / 100,
		total: Math.round(total * 100) / 100,
		category,
		date: new Date().toISOString().split('T')[0]
	};
}

export function getCategoryColor(category: string): string {
	switch (category) {
		case 'Low Impact':
			return 'bg-green-500';
		case 'Moderate Impact':
			return 'bg-yellow-500';
		case 'High Impact':
			return 'bg-orange-500';
		case 'Very High Impact':
			return 'bg-red-500';
		default:
			return 'bg-gray-500';
	}
}

export function getProgressWidth(value: number, max: number): number {
	return Math.min((value / max) * 100, 100);
}

export function validateCarbonInputs(inputs: Partial<CarbonInputs>): string[] {
	const errors: string[] = [];

	Object.entries(inputs).forEach(([key, value]) => {
		if (typeof value !== 'number' || value < 0) {
			errors.push(`${key} must be a non-negative number`);
		}
	});

	return errors;
}
