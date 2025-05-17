<script lang="ts">
	const socialLinks = [
		{ name: 'Linktree', href: 'https://linktr.ee/esperer8', icon: '/Linktree.svg' },
		{ name: 'YouTube', href: '/', icon: '/Youtube.svg' },
		{ name: 'Donate', href: '/', icon: '/Heart.svg' },
		{ name: 'Substack', href: '/', icon: '/Substack.svg' },
		{ name: 'Telegram', href: '/', icon: '/Telegram.svg' },
		{ name: 'Buy Us a Coffee', href: '/', icon: '/Cup.svg' },
		{ name: 'Instagram', href: '/', icon: '/Instagram.svg' },
		{ name: 'Bluesky', href: '/', icon: '/Bluesky.svg' }
	];

	const aboutUs = [
/* 		{ name: 'Our Mission', href: '/our-mission' }, */
		{ name: 'Six Pillars of Espérer', href: '/six-pillars' }
	];
	const ourWork = [
		{ name: 'Global Impact', href: '/global-impact' },
		{ name: 'Our E-magazine', href: '/our-journal' }
	];

	let email = '';
	let emailError = '';
	let successMessage = '';

	function validateEmail(email: string) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email.toLowerCase());
	}

	function handleSubmit() {
		emailError = '';
		successMessage = '';

		if (!validateEmail(email)) {
			emailError = 'Please enter a valid email address.';
			return;
		}

		// Simulate API call
		setTimeout(() => {
			successMessage = 'Thank you for subscribing!';
			email = '';
		}, 1000);
	}
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
					<a href="mailto:hello@esperer.org" class="font-bold underline hover:text-gray-300">
						we don't have an email yet :)
					</a>
				</p>
			</div>
		</div>

		<!-- Newsletter (smaller max width) -->
		<div class="flex w-full">
			<div class="w-full max-w-sm">
				<h3 class="mb-4 text-center text-xl font-semibold md:text-left">Join our newsletter! (Not Yet Functional)</h3>
				<div class="flex flex-col space-y-3">
					<input
						type="email"
						placeholder="Your email address"
						bind:value={email}
						class="rounded-lg p-3 text-black focus:ring-2 focus:ring-white focus:outline-none"
					/>
					<button
						on:click={handleSubmit}
						class="hover:bg-opacity-80 rounded-lg bg-white p-3 font-semibold text-[#b06b35] transition"
					>
						Subscribe
					</button>
					{#if emailError}
						<p class="text-sm text-red-200">{emailError}</p>
					{/if}
					{#if successMessage}
						<p class="text-sm text-green-200">{successMessage}</p>
					{/if}
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
