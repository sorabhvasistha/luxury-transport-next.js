// app/(admin)/admin/fleet/page.tsx
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function AdminFleetPage() {
  // READ: Fetch all vehicles
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { hourlyRate: 'desc' }
  });

  // CREATE: Server Action to add a vehicle
  async function addVehicle(formData: FormData) {
    "use server";
    
    await prisma.vehicle.create({
      data: {
        name: formData.get('name') as string,
        class: formData.get('class') as string,
        passengers: Number(formData.get('passengers')),
        luggage: Number(formData.get('luggage')),
        hourlyRate: Number(formData.get('hourlyRate')),
        imageUrl: formData.get('imageUrl') as string,
        description: formData.get('description') as string,
      }
    });

    // Instantly refresh the page data
    revalidatePath('/admin/fleet');
    revalidatePath('/fleet'); // Also refresh the public page
  }

  // DELETE: Server Action to remove a vehicle
  async function deleteVehicle(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    
    await prisma.vehicle.delete({ where: { id } });
    
    revalidatePath('/admin/fleet');
    revalidatePath('/fleet');
  }

  // UPDATE: Server Action to toggle availability
  async function toggleAvailability(formData: FormData) {
    "use server";
    const id = formData.get('id') as string;
    const currentStatus = formData.get('isAvailable') === 'true';
    
    await prisma.vehicle.update({
      where: { id },
      data: { isAvailable: !currentStatus }
    });
    
    revalidatePath('/admin/fleet');
    revalidatePath('/fleet');
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Fleet</h1>
        <p className="text-zinc-400 text-sm">Add, edit, or remove vehicles from your active roster.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ADD VEHICLE FORM */}
        <div className="xl:col-span-1">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-6">Add New Vehicle</h2>
            
            <form action={addVehicle} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Vehicle Name</label>
                <input name="name" required placeholder="e.g. Range Rover Vogue" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Class</label>
                  <input name="class" required placeholder="SUV" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Hourly Rate ($)</label>
                  <input name="hourlyRate" type="number" required placeholder="150" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Passengers</label>
                  <input name="passengers" type="number" required placeholder="4" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Luggage</label>
                  <input name="luggage" type="number" required placeholder="4" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Image URL or Local Path</label>
                <input name="imageUrl" required placeholder="/fleet/car.jpg or https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white" />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
                <textarea name="description" required rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-zinc-200 transition-colors mt-2">
                Save Vehicle
              </button>
            </form>
          </div>
        </div>

        {/* VEHICLE LIST */}
        <div className="xl:col-span-2 space-y-4">
          {vehicles.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
              No vehicles in the database. Add one to get started.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-6 items-center">
                {/* Vehicle Thumbnail */}
                <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                  <Image 
                    src={vehicle.imageUrl} 
                    alt={vehicle.name} 
                    fill 
                    className="object-cover" 
                    sizes="128px"
                  />
                </div>
                
                {/* Vehicle Details */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <h3 className="text-lg font-bold">{vehicle.name}</h3>
                    <span className="text-xs bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">
                      {vehicle.class}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">
                    ${vehicle.hourlyRate}/hr • {vehicle.passengers} Pass • {vehicle.luggage} Bags
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                    
                    {/* Toggle Status */}
                    <form action={toggleAvailability}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <input type="hidden" name="isAvailable" value={vehicle.isAvailable.toString()} />
                      <button type="submit" className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${vehicle.isAvailable ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                        {vehicle.isAvailable ? 'Active' : 'Hidden'}
                      </button>
                    </form>

                    {/* Delete */}
                    <form action={deleteVehicle}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button type="submit" className="text-xs px-3 py-1.5 rounded font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        Delete
                      </button>
                    </form>
                    
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}