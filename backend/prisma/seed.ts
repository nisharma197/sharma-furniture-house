import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@sharmafurniturehouse.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  const name = process.env.ADMIN_NAME || "Dhananjay Sharma";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { name, email, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`Admin ready: ${admin.email}`);

  // 1. SERVICES WITH COVER IMAGES
  const serviceData = [
    {
      title: "Custom Modular Wardrobes",
      slug: "custom-modular-wardrobes",
      description:
        "Sliding, hinged, or walk-in wardrobes custom-designed around your bedroom space and storage requirements, with internal shelving, drawers, pull-out shoe racks, and mirror units.",
      materials: "Waterproof Marine Plywood, Commercial Plywood, Premium Laminates & Veneers",
      finish: "High Gloss Acrylic, Matte Laminate, Natural Wood Veneer, or Duco Polish",
      features: ["Custom internal layout", "Soft-close German fittings", "Built-in LED lighting options", "Termite & moisture resistant"],
      coverImage: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 1,
    },
    {
      title: "Custom Wooden Beds & Storage Beds",
      slug: "custom-wooden-beds",
      description:
        "Handcrafted solid Sheesham and Teak wood beds with hydraulic storage, upholstered headboards, and side tables built to match your bedroom dimensions.",
      materials: "Solid Sheesham Wood, Teak Wood, Heavy-Duty Hydraulic Lift Systems",
      finish: "Melamine Polish, PU Coating, Walnut Stain, Natural Teak Finish",
      features: ["Hydraulic storage options", "Custom headboard cushioning", "Sturdy tongue-and-groove joinery", "Noise-free frame design"],
      coverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 2,
    },
    {
      title: "Handcrafted Sofa Sets & Living Woodwork",
      slug: "custom-sofa-sets",
      description:
        "Custom solid wood sofa sets, L-shape sectionals, accent chairs, and coffee tables built to your exact room size, foam density preference, and fabric selection.",
      materials: "Solid Teak & Sal Wood Frame, High-Resilience 40-Density Foam, Premium Upholstery",
      finish: "Melamine/PU Polish for wood trims, stain-resistant fabric/leatherette",
      features: ["Custom seating dimensions", "Choice of 200+ fabric options", "Heavy-duty wooden frame warranty", "Matching side tables included"],
      coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 3,
    },
    {
      title: "Modular Kitchen Furniture & Cabinets",
      slug: "modular-kitchen-woodwork",
      description:
        "Complete modular kitchen cabinets, shutters, pantry towers, and breakfast counters manufactured on site or pre-built in workshop with boiling-water-proof (BWP) marine ply.",
      materials: "BWP Grade Marine Plywood, Stainless Steel 304 Baskets & Accessories",
      finish: "Anti-Scratch Acrylic, PU Lacquer, Heavy-Duty PVC Edge Banded Laminates",
      features: ["BWP Waterproof Plywood base", "Hafele / Hettich soft-close hardware", "Custom cutlery & pantry pull-outs", "10-Year warranty on cabinet structure"],
      coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 4,
    },
    {
      title: "TV Units & Living Room Paneling",
      slug: "tv-units-living-paneling",
      description:
        "Modern floating TV units, wall paneling with acoustic slats, marble-finish laminate backdrops, hidden wire management channels, and display shelves.",
      materials: "HDMR Board, Plywood, Charcoal Louvers, Metallic Trims",
      finish: "Veneer, Fluted Louver Panels, Matte Laminate",
      features: ["Concealed cable routing", "Integrated ambient LED strips", "Floating drawer consoles", "Custom soundbar mounts"],
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 5,
    },
    {
      title: "Commercial & Office Carpentry Projects",
      slug: "commercial-office-carpentry",
      description:
        "Complete interior woodwork for corporate offices, reception desks, conference tables, workstation partitions, hostel bunk beds, school desks, and hotel furniture.",
      materials: "Commercial Ply, Solid Wood, Toughened Glass, Steel Frameworks",
      finish: "Melamine Polish, Fire-Retardant Laminates",
      features: ["Bulk production capacity", "Turnkey project execution", "Strict site timeline compliance", "Durable commercial grade hardware"],
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
      sortOrder: 6,
    },
  ];

  for (const service of serviceData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`Seeded ${serviceData.length} services with cover images`);

  // 2. PROJECTS WITH COVER & DETAIL IMAGES
  const projectsData = [
    {
      title: "Complete Villa Interior Woodwork – Saket Nagar, Indore",
      slug: "villa-interior-woodwork-saket-nagar",
      description:
        "Full turnkey woodwork project for a 4-BHK duplex villa in Saket Nagar, Indore. Includes custom floor-to-ceiling teak wardrobes, master bedroom hydraulic storage bed with padded headboard, modular marine ply kitchen with acrylic shutters, fluted panel TV unit, and teak main entrance door frame.",
      category: "VILLA" as const,
      location: "Saket Nagar, Indore",
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80", caption: "Living Room Teak Paneling", sortOrder: 1 },
        { url: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1000&q=80", caption: "Master Bedroom Wardrobe", sortOrder: 2 },
        { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80", caption: "Modular Kitchen Shutters", sortOrder: 3 },
      ],
    },
    {
      title: "Corporate Office Desk & Reception Work – Vijay Nagar",
      slug: "corporate-office-desk-reception-vijay-nagar",
      description:
        "Custom woodworking for a 3,500 sq.ft IT office in Vijay Nagar, Indore. Hand-crafted curved reception counter with backlit logo panel, 12-seater conference table with solid teak edge banding, 24 modular workstation desks, and executive director cabin desk with integrated storage.",
      category: "OFFICE" as const,
      location: "Vijay Nagar, Indore",
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80", caption: "Conference Table & Seating", sortOrder: 1 },
        { url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80", caption: "Executive Cabin Woodwork", sortOrder: 2 },
      ],
    },
    {
      title: "Boutique Hotel Bedroom Sets & Reception – AB Road, Indore",
      slug: "boutique-hotel-bedroom-sets-ab-road",
      description:
        "Turnkey bedroom furniture for 18 guest rooms at a boutique hotel on AB Road. Each room features custom king-size wooden bed frame with built-in side tables, luggage rack, study desk, wardrobe unit, and solid wood bathroom door frames.",
      category: "HOTEL" as const,
      location: "AB Road, Indore",
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80", caption: "Hotel Suite Bed & Side Tables", sortOrder: 1 },
      ],
    },
    {
      title: "Hostel Heavy-Duty Bunk Beds & Study Desks – South Tukoganj",
      slug: "hostel-bunk-beds-study-desks-south-tukoganj",
      description:
        "Bulk furniture project for a 60-bed student hostel in South Tukoganj, Indore. Heavy-duty double bunk beds built with Sal wood framing, integrated steel ladder support, individual lockable wooden study tables, and wardrobe lockers.",
      category: "HOSTEL" as const,
      location: "South Tukoganj, Indore",
      isFeatured: true,
      coverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80", caption: "Heavy Duty Wooden Bed Frame", sortOrder: 1 },
      ],
    },
  ];

  for (const proj of projectsData) {
    const { images, ...rest } = proj;
    const project = await prisma.project.upsert({
      where: { slug: rest.slug },
      update: rest,
      create: {
        ...rest,
        images: { create: images },
      },
    });
  }
  console.log(`Seeded ${projectsData.length} projects with image galleries`);

  // 3. GALLERY IMAGES (FEATURED & REGULAR)
  const galleryData = [
    {
      url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      caption: "Handcrafted Teak Wood Sofa Set with Custom Upholstery",
      altText: "Teak wood sofa set built for residential client in Indore",
      category: "Sofa Sets",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1000&q=80",
      caption: "Floor-to-Ceiling Sliding Wardrobe with Mirror & Soft Close",
      altText: "Custom sliding wardrobe built for Saket Nagar bedroom",
      category: "Wardrobes",
      isFeatured: true,
      sortOrder: 2,
    },
    {
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      caption: "Solid Sheesham King Size Storage Bed with Padded Headboard",
      altText: "Hydraulic king bed frame handcrafted in workshop",
      category: "Beds",
      isFeatured: true,
      sortOrder: 3,
    },
    {
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      caption: "Acrylic & Marine Ply Modular Kitchen Installation",
      altText: "L-shaped modular kitchen cabinets with soft close fittings",
      category: "Modular Kitchen",
      isFeatured: true,
      sortOrder: 4,
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      caption: "Fluted Wood Wall Paneling & Floating TV Console Unit",
      altText: "Modern living room TV console and wood fluted wall backdrop",
      category: "TV Units",
      isFeatured: true,
      sortOrder: 5,
    },
    {
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      caption: "Custom Wooden Dining Table with 6 Matching Teak Chairs",
      altText: "6 seater solid teak wood dining table set",
      category: "Dining Sets",
      isFeatured: true,
      sortOrder: 6,
    },
    {
      url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80",
      caption: "Carpentry Workshop Precision Sawing & Joinery Work",
      altText: "Mr. Dhananjay Sharma working on solid wood joinery at workshop",
      category: "Workshop",
      isFeatured: false,
      sortOrder: 7,
    },
    {
      url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80",
      caption: "Handcrafted Wooden Partition Screen & Storage Display",
      altText: "Decorative wooden room divider partition",
      category: "Partitions",
      isFeatured: false,
      sortOrder: 8,
    },
  ];

  for (const img of galleryData) {
    const existing = await prisma.galleryImage.findFirst({ where: { url: img.url } });
    if (!existing) {
      await prisma.galleryImage.create({ data: img });
    }
  }
  console.log(`Seeded ${galleryData.length} gallery images`);

  // 4. TESTIMONIALS
  const testimonialData = [
    {
      clientName: "Rajesh & Sunita Agarwal",
      location: "Vijay Nagar, Indore",
      projectType: "Full House Woodwork",
      message:
        "Dhananjay ji built all our bedroom wardrobes, double bed with hydraulic storage, and TV unit. His attention to measurements and wood quality is top notch. He delivered right on schedule!",
      rating: 5,
    },
    {
      clientName: "Dr. Alok Verma",
      location: "Saket Nagar, Indore",
      projectType: "Modular Kitchen & Wardrobes",
      message:
        "We wanted a custom kitchen made with genuine BWP marine ply because ready-made options in showrooms are overpriced and lower quality. Sharma Furniture House crafted a stunning kitchen exactly to our layout.",
      rating: 5,
    },
    {
      clientName: "Vikram Singh Solanki",
      location: "AB Road, Indore",
      projectType: "Hotel Furniture Project",
      message:
        "Sharma Furniture House handled the entire carpentry contract for our 18-room hotel. Heavy duty teak beds, study desks, and luggage racks were built with exceptional durability.",
      rating: 5,
    },
  ];

  for (const test of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { clientName: test.clientName } });
    if (!existing) await prisma.testimonial.create({ data: test });
  }
  console.log(`Seeded testimonials`);

  // 5. FAQS
  const faqData = [
    {
      question: "Do you sell ready-made catalogue furniture?",
      answer:
        "No. Sharma Furniture House operates purely on a custom client-order basis. We do NOT maintain a showroom or ready-made stock. Mr. Dhananjay Sharma works directly with customers to build furniture to exact dimensions, wood choice, and design preferences.",
      sortOrder: 1,
    },
    {
      question: "Do you visit the client's site for measurements in Indore?",
      answer:
        "Yes! For projects in and around Indore, Mr. Dhananjay Sharma or our team personally visits your home, office, or site to take precise measurements, inspect room layouts, and discuss wood, laminate, and hardware options.",
      sortOrder: 2,
    },
    {
      question: "What types of wood and materials do you use?",
      answer:
        "We work with premium solid woods like Teak (Sagwan) and Sheesham, high-grade Waterproof Marine Plywood (BWP/BWR), Commercial Plywood, HDMR board, and top-tier laminate, veneer, acrylic, or PU finish options.",
      sortOrder: 3,
    },
    {
      question: "Can you build furniture based on a photo or Pinterest design I provide?",
      answer:
        "Absoluting! You can share any design photo, architect drawing, or Pinterest reference via WhatsApp or during consultation. We will customize the dimensions to fit your space perfectly.",
      sortOrder: 4,
    },
    {
      question: "What commercial or institutional projects can you handle?",
      answer:
        "We handle complete interior woodwork for corporate offices, hotels, restaurants, cafes, schools, colleges, coaching institutes, hospitals, clinics, hostels, shops, and showrooms.",
      sortOrder: 5,
    },
  ];

  for (const faq of faqData) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) await prisma.faqItem.create({ data: faq });
  }
  console.log(`Seeded FAQs`);

  // 6. SITE SETTINGS
  const settingsData = [
    { key: "businessName", value: "Sharma Furniture House" },
    { key: "ownerName", value: "Mr. Dhananjay Sharma" },
    { key: "experience", value: "30+ Years" },
    { key: "phone", value: "+91 98765 43210" },
    { key: "whatsapp", value: "919876543210" },
    { key: "email", value: "info@sharmafurniturehouse.com" },
    { key: "address", value: "203 Nandbag Colony, Near Marimata, Indore, Madhya Pradesh, India" },
    { key: "heroImageUrl", value: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80" },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`Seeded site settings`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
