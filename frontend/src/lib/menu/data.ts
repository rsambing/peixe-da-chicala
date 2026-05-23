import type { MenuCategory, MenuItem } from "./types";

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "peixes-grelhados",
    name: "Peixes Grelhados",
    description: "Frescos, bem temperados e no ponto.",
  },
  {
    id: "pratos-tradicionais",
    name: "Pratos Tradicionais",
    description: "Sabor caseiro com toque da casa.",
  },
  {
    id: "mariscos",
    name: "Mariscos",
    description: "Do mar para a grelha.",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    description: "Refrigerantes, sumos e água.",
  },
  {
    id: "sobremesas",
    name: "Sobremesas",
    description: "O final perfeito.",
  },
  {
    id: "extras",
    name: "Extras",
    description: "Acompanhamentos e molhos.",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "tilapia-grelhada",
    categoryId: "peixes-grelhados",
    name: "Tilápia Grelhada",
    shortDesc: "Grelhada na brasa, com limão e ervas.",
    description:
      "Tilápia fresca grelhada na brasa, temperada com limão, alho e ervas. Acompanha salada e escolha de funge ou batata.",
    ingredients: ["tilápia", "limão", "alho", "ervas", "sal"],
    priceKz: 6500,
    imageUrl:
      "https://images.unsplash.com/photo-1541544181031-7f0b5bdbf8d4?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
    tags: ["mais pedido"],
    recommendedExtraIds: ["piri-piri", "funge", "salada"],
  },
  {
    id: "cacusso-grelhado",
    categoryId: "peixes-grelhados",
    name: "Cacusso Grelhado",
    shortDesc: "O clássico da casa, suculento e bem servido.",
    description:
      "Cacusso grelhado com molho da casa (piri-piri opcional). Acompanha banana frita e salada.",
    ingredients: ["cacusso", "limão", "alho", "piri-piri (opcional)", "sal"],
    priceKz: 8500,
    imageUrl:
      "https://images.unsplash.com/photo-1604909053196-64c4c1b8a8d8?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
    tags: ["recomendado"],
    recommendedExtraIds: ["piri-piri", "banana-frita", "salada"],
  },
  {
    id: "calulu-peixe",
    categoryId: "pratos-tradicionais",
    name: "Calulu de Peixe",
    shortDesc: "Calulu bem apurado, com peixe e folhas.",
    description:
      "Calulu tradicional com peixe, folhas, quiabo e tempero caseiro. Acompanha funge.",
    ingredients: ["peixe", "folhas", "quiabo", "óleo de palma", "temperos"],
    priceKz: 7000,
    imageUrl:
      "https://images.unsplash.com/photo-1604909053778-26db3a3aad0f?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
    recommendedExtraIds: ["funge", "piri-piri"],
  },
  {
    id: "camarrao-grelhado",
    categoryId: "mariscos",
    name: "Camarão Grelhado",
    shortDesc: "Camarões na brasa com manteiga de alho.",
    description:
      "Camarão grelhado com manteiga de alho e limão. Acompanha batata e salada.",
    ingredients: ["camarão", "manteiga", "alho", "limão", "sal"],
    priceKz: 9500,
    imageUrl:
      "https://images.unsplash.com/photo-1604908813074-90a9f8b7370f?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
    recommendedExtraIds: ["piri-piri", "salada"],
  },
  {
    id: "refrigerante",
    categoryId: "bebidas",
    name: "Refrigerante",
    shortDesc: "Lata 330ml (Coca-Cola, Fanta, Sprite).",
    description: "Refrigerante em lata 330ml. Indique a preferência nas observações.",
    priceKz: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "agua",
    categoryId: "bebidas",
    name: "Água",
    shortDesc: "Água 500ml.",
    description: "Água mineral 500ml.",
    priceKz: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1532634896-26909d0d4b05?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "mousse-maracuja",
    categoryId: "sobremesas",
    name: "Mousse de Maracujá",
    shortDesc: "Leve, fresca e cremosa.",
    description: "Mousse de maracujá caseira.",
    priceKz: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1614707267537-2f2a7f6a64a6?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "piri-piri",
    categoryId: "extras",
    name: "Molho Piri-Piri",
    shortDesc: "Picante da casa.",
    description: "Molho piri-piri artesanal.",
    priceKz: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1625944525533-473f1cbe4a02?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "funge",
    categoryId: "extras",
    name: "Funge",
    shortDesc: "Acompanhamento tradicional.",
    description: "Porção de funge (para acompanhar o prato).",
    priceKz: 700,
    imageUrl:
      "https://images.unsplash.com/photo-1604909053882-4b6d4d3b3b5b?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "salada",
    categoryId: "extras",
    name: "Salada",
    shortDesc: "Fresca e leve.",
    description: "Porção de salada (alface, tomate e cebola).",
    priceKz: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
  {
    id: "banana-frita",
    categoryId: "extras",
    name: "Banana Frita",
    shortDesc: "Dourada e crocante.",
    description: "Porção de banana frita.",
    priceKz: 650,
    imageUrl:
      "https://images.unsplash.com/photo-1604909052929-3b61c9f8b77b?auto=format&fit=crop&w=1400&q=80",
    isAvailable: true,
  },
];

export function getMenuItemById(id: string) {
  return MENU_ITEMS.find((item) => item.id === id);
}

export function getMenuItemsByCategory(categoryId: MenuItem["categoryId"]) {
  return MENU_ITEMS.filter((item) => item.categoryId === categoryId);
}
