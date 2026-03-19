const dbUrl = "https://barrakesh-nuevo-default-rtdb.firebaseio.com";

const branches = {
    "1": {
        name: "MATRIZ",
        addr: "C. Parras 72-local 4, Bosques del Prado Oriente, 20159 Aguascalientes, Ags.",
        status: "Operativo",
        capacity: "Matriz + Music Studio",
        city: "Aguascalientes",
        image: "https://images.unsplash.com/photo-1599351431247-f10bc93d0187?auto=format&fit=crop&q=80&w=800",
        hours: "Lunes a Sábado de 11:00 am a 8:00 pm",
        note: "En esta ubicación se encuentra nuestro Barrakesh Music Studio 🎙️",
        activeDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
        openTime: "11:00",
        closeTime: "20:00"
    },
    "2": {
        name: "PLAZA SANTA FE",
        addr: "Dentro del gimnasio LVDVS (Av. Universidad 811, Bosques del Prado Sur, 20130 Aguascalientes, Ags.)",
        status: "Próxima Apertura",
        capacity: "Próximamente",
        city: "Aguascalientes",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
        activeDays: [1, 2, 3, 4, 5, 6],
        openTime: "11:00",
        closeTime: "20:00"
    }
};

const barbers = {
    "b1": { name: "Torny", spec: "Master Barber", status: "Activo", phone: "", initials: "TR", workedBranches: [1], image: "https://images.unsplash.com/photo-1503460293676-4d2be411cca0?auto=format&fit=crop&q=80&w=400" },
    "b2": { name: "Ricardo", spec: "Master Barber", status: "Activo", phone: "", initials: "RC", workedBranches: [1], image: "https://images.unsplash.com/photo-1520338661039-414804804437?auto=format&fit=crop&q=80&w=400" }
};

const services = {
    // Paquetes
    "s1": { category: "Barber Shop", name: "Paquete Pro", price: 250, desc: "Cabello + Barba", tag: "Pack" },
    "s2": { category: "Barber Shop", name: "Paquete Élite", price: 300, desc: "Cabello + Barba + Ceja", tag: "Estelar" },
    // Individuales
    "s3": { category: "Barber Shop", name: "Corte de cabello", price: 180, desc: "Corte clásico o moderno." },
    "s4": { category: "Barber Shop", name: "Corte de barba", price: 100, desc: "Afeitado clásico y delineado." },
    "s5": { category: "Barber Shop", name: "Diseño de ceja", price: 80, desc: "Delineado con navaja." },
    "s6": { category: "Barber Shop", name: "Diseño de grecas", price: 80, desc: "Líneas o figuras personalizadas." },
    "s7": { category: "Barber Shop", name: "Corte infantil", price: 150, desc: "Hasta 12 años." },
    // Music Studio
    "s8": { category: "Music Studio", name: "Grabación (2 horas)", price: 450, desc: "Renta de cabina por 2 horas.", tag: "Pro" },
    "s9": { category: "Music Studio", name: "Instrumentales personalizadas", price: 450, desc: "Beat único a tu medida." },
    "s10": { category: "Music Studio", name: "Mezcla", price: 350, desc: "Balance y ecualización de tus tracks." },
    "s11": { category: "Music Studio", name: "Mastering", price: 350, desc: "Volumen comercial y calidad listos." },
    "s12": { category: "Music Studio", name: "Video", price: 1000, desc: "Producción de video musical o sesión." }
};

async function updateDB() {
    console.log("Updating branches...");
    await fetch(`${dbUrl}/branches.json`, { method: 'PUT', body: JSON.stringify(branches) });
    console.log("Updating barbers...");
    await fetch(`${dbUrl}/barbers.json`, { method: 'PUT', body: JSON.stringify(barbers) });
    console.log("Updating services...");
    await fetch(`${dbUrl}/services.json`, { method: 'PUT', body: JSON.stringify(services) });
    console.log("Done!");
}

updateDB().catch(console.error);
