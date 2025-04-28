<script lang="ts">
	const socialLinks = [
		{ name: 'Linktree', href: '/', icon: '/linktree.svg' },
		{ name: 'Donate', href: '/', icon: '/heart.svg' },
		{ name: 'Telegram', href: '/', icon: '/telegram-light-sharp.svg' },
		{ name: 'Discord', href: '/', icon: '/discord-light-sharp.svg' },
		{ name: 'Facebook', href: '/', icon: '/facebook-light-sharp.svg' }
	];

	const aboutUs = ['Our Mission', 'Six Pillars of Espérer'];
	const ourWork = ['Global Impact', 'Our Journal'];
</script>

<footer class="bg-[#b06b35] py-12 text-white">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
		<!-- Logo and Social -->
		<div class="space-y-6">
			<a href="/" class="flex items-center">
				<img
					src={'/esprer-logo-transparent.svg'}
					alt="Espérer"
					class="h-12 h-[72px] mb-5"
				/>
			</a>
			<div class="flex flex-wrap gap-4">
				{#each socialLinks as { href, icon, name }}
					<a {href} target="_blank" rel="noopener noreferrer" aria-label={name}>
						<img
							src={icon}
							alt={name}
							class="h-10 w-10 transition-transform hover:scale-110 hover:rotate-6"
						/>
					</a>
				{/each}
			</div>
		</div>

		<!-- Products -->
		<div>
			<h3 class="mb-4 text-xl font-semibold">About Us</h3>
			<ul class="space-y-2">
				{#each aboutUs as about}
					<li class="cursor-pointer hover:underline">{about}</li>
				{/each}
			</ul>
		</div>

		<!-- About -->
		<div>
			<h3 class="mb-4 text-xl font-semibold">Our Work</h3>
			<ul class="space-y-2">
				{#each ourWork as work}
					<li class="cursor-pointer hover:underline">{work}</li>
				{/each}
			</ul>
		</div>

		<!-- Contact -->
		<div class="space-y-4">
			<h3 class="mb-4 text-xl font-semibold">Contact Us</h3>
			<p>Email:</p>
			<p class="font-bold break-words">we don't have an email yet :)</p>
		</div>
	</div>

	<div class="mt-12 text-center text-sm opacity-70">
		© {new Date().getFullYear()} <span lang="fr">Espérer.</span> All rights reserved.
	</div>
</footer>
