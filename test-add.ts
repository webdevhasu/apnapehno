
import { db } from './src/lib/db';
import { products } from './src/lib/db/schema';
import { generateSlug } from './src/lib/utils';

async function addDummyProducts() {
  const dummyProducts = [
    {
      name: "Luxury Party Wear",
      price: "6800",
      categoryId: 2,
      images: ["https://i.pinimg.com/736x/d7/94/3b/d7943bc5ccedff64ee3759e23149fdfa.jpg"],
      description: "A luxury party wear suit with intricate detailing.",
      sizes: ["M", "L"],
      colors: ["Blue", "Gold"],
      fabric: "Chiffon",
      pieces: "3 Piece",
      stockQuantity: 12
    },
    {
      name: "Elegant Pret Collection",
      price: "3900",
      categoryId: 1,
      images: ["https://i.pinimg.com/236x/6a/c3/75/6ac375a2efb45ca2bb368970b08d8169.jpg"],
      description: "Elegant daily wear pret for modern women.",
      sizes: ["S", "M", "L"],
      colors: ["Pink", "White"],
      fabric: "Lawn",
      pieces: "2 Piece",
      stockQuantity: 25
    },
    {
      name: "Floral Summer Kurti",
      price: "2500",
      categoryId: 1,
      images: ["https://i.pinimg.com/736x/2a/d6/9a/2ad69a95dc38b272481d31917b2a2ed5.jpg"],
      description: "Fresh floral designs for the summer season.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Cyan", "Floral"],
      fabric: "Cotton",
      pieces: "1 Piece",
      stockQuantity: 30
    },
    {
      name: "Modern Chic Suit",
      price: "4800",
      categoryId: 2,
      images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq0AbMlR2PwXGI0Uqx863uYeQPN95-ElJjBgkJy-ClFQ&s"],
      description: "Chic and modern suit for special gatherings.",
      sizes: ["S", "M", "L"],
      colors: ["Black", "Purple"],
      fabric: "Silk",
      pieces: "3 Piece",
      stockQuantity: 8
    }
  ];

  try {
    for (const p of dummyProducts) {
      const slug = generateSlug(p.name) + "-" + Math.random().toString(36).substring(2, 6);
      await db.insert(products).values({
        ...p,
        slug,
        inStock: true,
        isNew: true,
        isSale: false,
        isFeatured: true
      });
      console.log(`Added: ${p.name}`);
    }
    console.log("Remaining dummy products added successfully!");
  } catch (e) {
    console.error("Error adding products:", e);
  }
}

addDummyProducts();
