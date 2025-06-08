<!-- src/lib/components/statisty/MetricCard.svelte -->
<script lang="ts">
	export let title: string;
	export let value: string | number;
	export let icon: string;
	export let color: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'gray' = 'blue';
	export let subtitle: string = '';
	export let trend: 'up' | 'down' | 'neutral' | null = null;
	export let clickable: boolean = false;
	export let loading: boolean = false;

	// Color mappings
	const colorClasses = {
		green: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-600',
			accent: 'text-green-500',
			hover: 'hover:bg-green-100'
		},
		blue: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-600',
			accent: 'text-blue-500',
			hover: 'hover:bg-blue-100'
		},
		red: {
			bg: 'bg-red-50',
			border: 'border-red-200',
			text: 'text-red-600',
			accent: 'text-red-500',
			hover: 'hover:bg-red-100'
		},
		yellow: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			text: 'text-yellow-600',
			accent: 'text-yellow-500',
			hover: 'hover:bg-yellow-100'
		},
		purple: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			text: 'text-purple-600',
			accent: 'text-purple-500',
			hover: 'hover:bg-purple-100'
		},
		gray: {
			bg: 'bg-gray-50',
			border: 'border-gray-200',
			text: 'text-gray-600',
			accent: 'text-gray-500',
			hover: 'hover:bg-gray-100'
		}
	};

	const trendIcons = {
		up: '↗️',
		down: '↘️',
		neutral: '➡️'
	};

	$: currentColors = colorClasses[color];

	function handleClick() {
		if (clickable) {
			const event = new CustomEvent('metricClick', {
				detail: { title, value, icon, color }
			});
			document.dispatchEvent(event);
		}
	}
</script>

{#if clickable}
	<button
		type="button"
		class="group relative w-full rounded-lg border p-4 text-left transition-all duration-200 {currentColors.bg} {currentColors.border} {currentColors.hover} hover:shadow-md {loading
			? 'animate-pulse'
			: ''}"
		on:click={handleClick}
	>
		{#if loading}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div class="h-4 w-16 rounded bg-gray-200"></div>
					<div class="h-6 w-6 rounded bg-gray-200"></div>
				</div>
				<div class="h-6 w-20 rounded bg-gray-200"></div>
				{#if subtitle}
					<div class="h-3 w-24 rounded bg-gray-200"></div>
				{/if}
			</div>
		{:else}
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-gray-700">{title}</h3>
				<span class="text-lg" role="img" aria-label={title}>{icon}</span>
			</div>

			<div class="mb-1 flex items-baseline">
				<span class="text-2xl font-bold {currentColors.text}">{value}</span>
				{#if trend}
					<span class="ml-2 text-sm" title="Trend: {trend}">
						{trendIcons[trend]}
					</span>
				{/if}
			</div>

			{#if subtitle}
				<p class="text-xs text-gray-500">{subtitle}</p>
			{/if}

			<div class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
				<svg
					class="h-4 w-4 {currentColors.accent}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		{/if}
	</button>
{:else}
	<div
		class="relative rounded-lg border p-4 transition-all duration-200 {currentColors.bg} {currentColors.border} {loading
			? 'animate-pulse'
			: ''}"
		role="presentation"
	>
		{#if loading}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div class="h-4 w-16 rounded bg-gray-200"></div>
					<div class="h-6 w-6 rounded bg-gray-200"></div>
				</div>
				<div class="h-6 w-20 rounded bg-gray-200"></div>
				{#if subtitle}
					<div class="h-3 w-24 rounded bg-gray-200"></div>
				{/if}
			</div>
		{:else}
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-gray-700">{title}</h3>
				<span class="text-lg" role="img" aria-label={title}>{icon}</span>
			</div>

			<div class="mb-1 flex items-baseline">
				<span class="text-2xl font-bold {currentColors.text}">{value}</span>
				{#if trend}
					<span class="ml-2 text-sm" title="Trend: {trend}">
						{trendIcons[trend]}
					</span>
				{/if}
			</div>

			{#if subtitle}
				<p class="text-xs text-gray-500">{subtitle}</p>
			{/if}
		{/if}
	</div>
{/if}
