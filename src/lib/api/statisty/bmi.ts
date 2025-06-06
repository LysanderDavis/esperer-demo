// src/lib/api/statisty/bmi.ts
export interface BMIData {
	weight: number;
	height: number;
	bmi: number;
	category: string;
}

export function calculateBMI(weight: number, height: number): BMIData {
	const bmi = weight / (height * height);
	const category = getBMICategory(bmi);
	return { weight, height, bmi: Math.round(bmi * 10) / 10, category };
}

function getBMICategory(bmi: number): string {
	if (bmi < 18.5) return 'Underweight';
	if (bmi < 25) return 'Normal weight';
	if (bmi < 30) return 'Overweight';
	return 'Obese';
}