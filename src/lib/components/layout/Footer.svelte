<script lang="ts">
	const socialLinks = [
		{ name: 'Linktree', href: 'https://linktr.ee/esperer8', icon: '/Linktree.svg' },
		{ name: 'YouTube', href: 'https://www.youtube.com/@Esp%C3%A9rer8', icon: '/Youtube.svg' },
		{ name: 'Donate', href: '/', icon: '/Heart.svg' },
		{ name: 'Substack', href: 'https://substack.com/@esperer8?utm_campaign=unknown&utm_medium=web', icon: '/Substack.svg' },
		{ name: 'Telegram', href: 'https://t.me/Esperer8', icon: '/Telegram.svg' },
		{ name: 'Buy Us a Book', href: 'https://buymeacoffee.com/esperer8', icon: '/Cup.svg' },
		{ name: 'Instagram', href: 'https://www.instagram.com/esperer08', icon: '/Instagram.svg' },
		{ name: 'Bluesky', href: 'https://bsky.app/profile/esperer8.substack.com', icon: '/Bluesky.svg' },
		{ name: 'X', href: 'https://x.com/Esprer497108', icon: '/X.svg' }
	];

	const aboutUs = [
/* 		{ name: 'Our Mission', href: '/our-mission' }, */
		{ name: 'Six Pillars of Espérer', href: '/six-pillars' }
	];
	const ourWork = [
		{ name: 'Global Impact', href: '/global-impact' },
		{ name: 'Our E-magazine', href: '/our-journal' }
	];
</script>

<footer class="bg-[#b06b35] py-12 text-white">
	<div class="mx-auto flex max-w-7xl flex-col gap-12 px-6 pt-15">
		<!-- Top: Links and Logo -->
		<div class="grid grid-cols-1 gap-y-8 md:grid-cols-4">
			<!-- Logo -->
			<div class="md:pr-4">
				<a href="/" class="flex items-center">
					<img src={'/esprer-logo-transparent.svg'} alt="Espérer" class="mb-5 h-[72px]" />
				</a>
			</div>

			<!-- About Us -->
			<div class="md:px-4">
				<h3 class="mb-4 text-xl font-semibold">About Us</h3>
				<ul class="space-y-2">
					{#each aboutUs as { name, href }}
						<li>
							<a {href} class="hover:underline">{name}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Our Work -->
			<div class="md:px-4">
				<h3 class="mb-4 text-xl font-semibold">Our Work</h3>
				<ul class="space-y-2">
					{#each ourWork as { name, href }}
						<li>
							<a {href} class="hover:underline">{name}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div class="space-y-4 md:px-4">
				<h3 class="mb-4 text-xl font-semibold">Contact Us</h3>
				<p>Email:</p>
				<p>
					<a href="mailto:esperer8@substack.com" class="font-bold underline hover:text-gray-300">
						esperer8@substack.com
					</a>
				</p>
			</div>
		</div>

		<!-- Newsletter (Substack embed with similar styling) -->
		<div class="flex w-full">
			<div class="w-full max-w-sm">
				<h3 class="mb-4 text-center text-xl font-semibold md:text-left">Join our newsletter!</h3>
				<div class="rounded-lg bg-white p-3">
					<iframe 
						src="https://esperer8.substack.com/embed" 
						width="100%" 
						height="240" 
						style="border: none; background: white;" 
						frameborder="0" 
						scrolling="no"
						title="Substack Newsletter Signup"
					></iframe>
				</div>
			</div>
		</div>

		<!-- Social media icons -->
		<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
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

		<!-- Copyright -->
		<div class="mt-8 text-center text-sm opacity-70">
			© {new Date().getFullYear()} <span lang="fr">Espérer.</span> All rights reserved.
		</div>
	</div>
</footer>