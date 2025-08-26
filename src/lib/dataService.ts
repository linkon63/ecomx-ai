import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import usersData from '@/data/users.json';
import ordersData from '@/data/orders.json';

// Types based on the JSON structure
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: {
    price: number;
    discountedPrice: number;
  };
  media: {
    mainMedia: {
      image: {
        url: string;
      };
    };
    items: Array<{
      image: {
        url: string;
      };
    }>;
  };
  productOptions: Array<{
    name: string;
    choices: Array<{
      value: string;
      description: string;
    }>;
  }>;
  stock: {
    inStock: boolean;
    quantity: number;
  };
  collections: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  media: {
    mainMedia: {
      image: {
        url: string;
      };
    };
  };
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

export interface Order {
  _id: string;
  number: string;
  buyerInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
  billingInfo: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  shippingInfo: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  lineItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    options: Record<string, string>;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  paymentStatus: string;
  fulfillmentStatus: string;
  dateCreated: string;
}

// Data service functions
export const dataService = {
  // Products
  async getProducts(limit?: number, skip?: number): Promise<{ items: Product[] }> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    const products = productsData as Product[];
    const startIndex = skip || 0;
    const endIndex = limit ? startIndex + limit : products.length;
    return {
      items: products.slice(startIndex, endIndex)
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = productsData as Product[];
    return products.find(product => product.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = productsData as Product[];
    return products.find(product => product._id === id) || null;
  },

  async getProductsByCategory(categoryId: string, limit?: number): Promise<{ items: Product[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = productsData as Product[];
    const filteredProducts = products.filter(product => 
      product.collections.includes(categoryId)
    );
    return {
      items: limit ? filteredProducts.slice(0, limit) : filteredProducts
    };
  },

  async searchProducts(query: string): Promise<{ items: Product[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = productsData as Product[];
    const searchResults = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return { items: searchResults };
  },

  // Categories
  async getCategories(): Promise<{ items: Category[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { items: categoriesData as Category[] };
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const categories = categoriesData as Category[];
    return categories.find(category => category.slug === slug) || null;
  },

  // Users
  async getCurrentUser(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    // For demo purposes, return the first user
    const users = usersData as User[];
    return users[0] || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const users = usersData as User[];
    return users.find(user => user.email === email) || null;
  },

  // Orders
  async getOrders(userEmail?: string): Promise<{ items: Order[] }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = ordersData as Order[];
    if (userEmail) {
      const userOrders = orders.filter(order => order.buyerInfo.email === userEmail);
      return { items: userOrders };
    }
    return { items: orders };
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = ordersData as Order[];
    return orders.find(order => order._id === orderId) || null;
  },

  // Cart simulation (using localStorage)
  getCart(): any {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : { lineItems: [] };
    }
    return { lineItems: [] };
  },

  updateCart(cart: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  },

  addToCart(productId: string, quantity: number, options: Record<string, string>): void {
    const cart = this.getCart();
    const existingItem = cart.lineItems.find((item: any) => 
      item.productId === productId && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const product = productsData.find(p => p._id === productId);
      if (product) {
        cart.lineItems.push({
          _id: `cart_${productId}_${Math.floor(Math.random() * 1000000)}`,
          productId,
          productName: product.name,
          quantity,
          price: product.price.discountedPrice || product.price.price,
          options,
          image: product.media.mainMedia.image.url
        });
      }
    }

    this.updateCart(cart);
  },

  removeFromCart(itemId: string): void {
    const cart = this.getCart();
    cart.lineItems = cart.lineItems.filter((item: any) => item._id !== itemId);
    this.updateCart(cart);
  },

  clearCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }
};
