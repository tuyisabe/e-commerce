import { ref, set, get } from 'firebase/database';
import { db } from '../firebase/config';

const defaultCategories = [
  {
    name: 'Electronics',
    createdAt: Date.now(),
  },
  {
    name: 'Clothing',
    createdAt: Date.now(),
  },
  {
    name: 'Books',
    createdAt: Date.now(),
  },
  {
    name: 'Home & Kitchen',
    createdAt: Date.now(),
  },
  {
    name: 'Sports & Outdoors',
    createdAt: Date.now(),
  },
  {
    name: 'Toys & Games',
    createdAt: Date.now(),
  },
  {
    name: 'Beauty & Personal Care',
    createdAt: Date.now(),
  },
  {
    name: 'Health & Wellness',
    createdAt: Date.now(),
  },
  {
    name: 'Automotive',
    createdAt: Date.now(),
  },
  {
    name: 'Office Products',
    createdAt: Date.now(),
  },
];

const defaultProducts = [
  {
    name: 'Laptop Pro X',
    description: 'High-performance laptop with the latest technology',
    price: 1299.99,
    category: 'Electronics',
    image: 'https://example.com/laptop.jpg',
    stock: 50,
    createdAt: Date.now(),
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running shoes for professional athletes',
    price: 89.99,
    category: 'Sports & Outdoors',
    image: 'https://example.com/shoes.jpg',
    stock: 100,
    createdAt: Date.now(),
  },
];

const users = {
  'admin123': {
    email: 'admin@example.com',
    role: 'admin',
    name: 'Admin User'
  },
  'customer123': {
    email: 'customer@example.com',
    role: 'customer',
    name: 'Test Customer'
  }
};

export const initializeDatabase = async () => {
  try {
    // Check if categories exist
    const categoriesRef = ref(db, 'categories');
    const categoriesSnapshot = await get(categoriesRef);
    
    if (!categoriesSnapshot.exists()) {
      console.log('Initializing categories...');
      // Add each category with a unique key
      for (const category of defaultCategories) {
        const newCategoryRef = ref(db, `categories/${Date.now()}`);
        await set(newCategoryRef, category);
      }
    }

    // Check if products exist
    const productsRef = ref(db, 'products');
    const productsSnapshot = await get(productsRef);
    
    if (!productsSnapshot.exists()) {
      console.log('Initializing products...');
      // Add each product with a unique key
      for (const product of defaultProducts) {
        const newProductRef = ref(db, `products/${Date.now()}`);
        await set(newProductRef, product);
      }
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const initializeUsers = async () => {
  try {
    await set(ref(db, 'users'), users);
    return true;
  } catch (error) {
    console.error('Error creating sample users:', error);
    return false;
  }
};
