# ShoesX - Modern E-commerce Platform

A full-featured e-commerce platform built with Next.js 15, specifically designed for shoe retailers. This application provides a complete shopping experience with product browsing, cart management, user authentication, and order processing.

## 🚀 Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse shoes by categories (Men, Women, Kids, Sports)
- **Advanced Search**: Search products by name with real-time filtering
- **Product Details**: Detailed product pages with image galleries and reviews
- **Shopping Cart**: Add/remove items with persistent cart using localStorage
- **Product Customization**: Select sizes, colors, and other product options

### 👤 User Management
- **User Authentication**: Login/logout functionality (demo mode)
- **User Profiles**: Manage personal information and addresses
- **Order History**: View past orders and order details

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern Interface**: Clean, intuitive design with Tailwind CSS
- **Image Galleries**: Interactive product image viewers
- **Loading States**: Smooth loading experiences with skeleton screens

### 🛠️ Technical Features
- **Server-Side Rendering**: Fast initial page loads with Next.js
- **Client-Side Navigation**: Smooth page transitions
- **State Management**: Zustand for cart and user state
- **Local Data**: JSON-based fake data for development and demo

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons & Images**: Next.js Image optimization
- **Data**: Local JSON files (products, categories, users, orders)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/linkon63/ecomx-ai.git
cd ecomx-ai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (optional for this demo):
```bash
# No environment variables required for the current setup
# All data is served from local JSON files
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── [slug]/            # Dynamic product pages
│   ├── list/              # Product listing page
│   ├── login/             # Authentication page
│   ├── orders/            # Order management
│   ├── profile/           # User profile
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── Add.tsx           # Add to cart component
│   ├── CartModal.tsx     # Shopping cart modal
│   ├── CategoryList.tsx  # Product categories
│   ├── ProductList.tsx   # Product grid
│   ├── Navbar.tsx        # Navigation bar
│   └── ...
├── context/              # React context providers
│   └── dataContext.tsx   # Data client context
├── data/                 # Local JSON data files
│   ├── products.json     # Product catalog
│   ├── categories.json   # Product categories
│   ├── users.json        # User data
│   └── orders.json       # Order history
├── hooks/                # Custom React hooks
│   ├── useDataClient.tsx # Data client hook
│   └── useCartStore.ts   # Cart state management
└── lib/                  # Utility functions
    ├── dataService.ts    # Data access layer
    └── actions.ts        # Server actions
```

## 🗃️ Data Structure

The application uses local JSON files for data storage:

### Products
- Product information with images, prices, and options
- Categories: Men, Women, Kids, Sports shoes
- Stock management and pricing

### Users
- User profiles with addresses
- Authentication simulation

### Orders
- Order history and details
- Order status tracking

## 🎯 Usage

### Adding Products to Cart
1. Browse products on the homepage or category pages
2. Click on a product to view details
3. Select size/color options if available
4. Click "Add to Cart"
5. View cart by clicking the cart icon

### User Authentication
- Click the profile icon to access login/profile
- Demo authentication (no real credentials required)
- Access order history and profile management

### Product Search
- Use the search bar to find specific products
- Filter by categories using the navigation menu
- Apply price filters on listing pages

## 🔧 Customization

### Adding New Products
Edit `src/data/products.json` to add new shoe products:
```json
{
  "_id": "new-product-id",
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Product description",
  "price": {
    "price": 100,
    "discountedPrice": 80
  },
  "media": {
    "mainMedia": {
      "image": {
        "url": "/product-image.jpg"
      }
    }
  }
}
```

### Styling
- Modify Tailwind CSS classes in components
- Update `tailwind.config.ts` for custom themes
- Add custom CSS in `src/app/globals.css`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Linkon** - [@linkon63](https://github.com/linkon63)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools

---

**Happy Shopping! 👟✨**
