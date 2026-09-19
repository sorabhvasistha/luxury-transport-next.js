export const metadata = {
	title: 'Leads | LuxeRide Transport',
};

export default function AdminLeadsPage() {
	return (
		<div className="max-w-5xl">
			<header className="mb-10">
				<h1 className="text-3xl font-bold tracking-tight mb-2">Leads</h1>
				<p className="text-zinc-400 text-sm">Review and follow up on incoming booking inquiries.</p>
			</header>

			<div className="border border-zinc-800 rounded-xl p-6 text-zinc-400">
				No booking inquiries to display.
			</div>
		</div>
	);
}
