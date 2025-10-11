const fridgeItems = [
  {
    img: '../../public/Cat_Icons/Dairy.png',
    name: 'Milk',
    qty: '1L',
    dateAdded: '2025-10-01',
    expiryDate: '2025-10-25',
    category: 'dairy',
  },
  {
    img: '../../public/Cat_Icons/Protein.png',
    name: 'Eggs',
    qty: '12 pcs',
    dateAdded: '2025-10-05',
    expiryDate: '2025-10-20',
    category: 'protein',
  },
  {
    img: '/images/missing/cheddar.png', // broken path → should fallback to Dairy
    name: 'Cheddar Cheese',
    qty: '200g',
    dateAdded: '2025-09-30',
    expiryDate: '2025-10-15',
    category: 'dairy',
  },
  {
    img: '../../public/Cat_Icons/Vegetable.png',
    name: 'Spinach',
    qty: '150g',
    dateAdded: '2025-10-08',
    expiryDate: '2025-10-12',
    category: 'vegetable',
  },
  {
    img: '/images/fridge/tomatoes.png',
    name: 'Tomatoes',
    qty: '500g',
    dateAdded: '2025-10-07',
    expiryDate: '2025-10-14',
    category: 'vegetable',
  },
  {
    img: '/images/missing/chicken.png', // broken path → should fallback to Protein
    name: 'Chicken Breast',
    qty: '2 pcs',
    dateAdded: '2025-10-04',
    expiryDate: '2025-10-11',
    category: 'protein',
  },
  {
    img: '/images/fridge/yogurt.png',
    name: 'Greek Yogurt',
    qty: '1 cup',
    dateAdded: '2025-10-02',
    expiryDate: '2025-10-16',
    category: 'dairy',
  },
  {
    img: '/images/missing/apple.png', // broken path → should fallback to Fruit
    name: 'Apples',
    qty: '4 pcs',
    dateAdded: '2025-10-06',
    expiryDate: '2025-10-20',
    category: 'fruit',
  },
  {
    img: '../../public/Cat_Icons/Sauce.png',
    name: 'Tomato Ketchup',
    qty: '250ml',
    dateAdded: '2025-09-25',
    expiryDate: '2026-03-01',
    category: 'sauces',
  },
  {
    img: '/images/missing/rice.png', // broken path → should fallback to Dry
    name: 'Basmati Rice',
    qty: '1kg',
    dateAdded: '2025-10-01',
    expiryDate: '2026-10-01',
    category: 'Dry-Ration',
  },

    {
    img: '/images/missing/rice.png', // broken path → should fallback to Dry
    name: 'Beef',
    qty: '1kg',
    dateAdded: '2025-10-01',
    expiryDate: '2025-10-02',
    category: 'protein',
  },
];

export default fridgeItems;

