import { galleryItems } from "@/data/mockData";
import Image from "next/image";

export default function GalleryPage() {
  return (
    <main className="min-h-screen py-24 px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">گالری کامل تصاویر</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryItems.map((item) => (
          <div key={item.id} className="bg-[#0d1526] rounded-2xl overflow-hidden border border-[#1e2d4a]">
            <div className="relative aspect-[4/3]">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="text-white font-semibold">{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
