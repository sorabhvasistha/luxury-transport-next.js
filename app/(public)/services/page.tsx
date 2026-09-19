// app/(public)/services/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Premium Chauffeur Services | LuxeRide Transport',
  description: 'From airport transfers to corporate travel and special events. Experience top-tier private transportation tailored to your schedule.',
};

export default function ServicesPage() {
  const services = [
    {
      title: 'Airport Transfers',
      description: 'Punctual, stress-free arrivals and departures. Our chauffeurs monitor your flight status in real-time to ensure they are waiting for you the moment you land, complete with meet-and-greet service at baggage claim.',
      icon: '✈️',
    },
    {
      title: 'Corporate Travel',
      description: 'Impress your clients and ensure your executives travel in ultimate comfort. We provide reliable, discreet, and Wi-Fi-enabled mobile environments so you can work on the go.',
      icon: '💼',
    },
    {
      title: 'Hourly & As-Directed',
      description: 'Keep a luxury vehicle and professional chauffeur at your disposal for as long as you need. Perfect for days packed with multiple meetings, shopping trips, or city tours without a fixed itinerary.',
      icon: '⏱️',
    },
    {
      title: 'Special Events & Weddings',
      description: 'Make your grand entrance unforgettable. Whether it is a gala, award ceremony, or your wedding day, our flawless vehicles and red-carpet service add the perfect touch of elegance.',
      icon: '🥂',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Services</h1>
        <p className="text-zinc-400 text-lg">
          We provide bespoke transportation solutions designed around your exact needs. Every journey is executed with precision, discretion, and uncompromising luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {services.map((service, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-900 transition-colors">
            <div className="text-4xl mb-6">{service.icon}</div>
            <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              {service.description}
            </p>
            <Link href="/book" className="text-sm font-semibold text-white border-b border-zinc-700 pb-1 hover:border-white transition-colors">
              Request this service →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Need a custom itinerary?</h2>
        <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
          Our logistics team can coordinate complex travel arrangements for roadshows, multi-city tours, and large group events. 
        </p>
        <Link href="/book" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors inline-block">
          Contact Our Concierge
        </Link>
      </div>
    </div>
  );
}