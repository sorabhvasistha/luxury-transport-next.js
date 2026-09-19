export const metadata = {
	title: 'Book a Ride | LuxeRide Transport',
	description: 'Request a private chauffeur ride with LuxeRide Transport.',
};

export default function BookPage() {
	return (
		<section className="max-w-4xl mx-auto px-6 py-20">
			<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Book Your Ride</h1>
			<p className="text-lg text-zinc-400 leading-8">
				Tell us about your journey and our team will help arrange the right vehicle and chauffeur service.
			</p>
		</section>
	);
}
