import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  Star, 
  Filter, 
  Menu, 
  User, 
  ArrowRight,
  Plus,
  Minus,
  MapPin,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  Share,
  Home,
  Grid3X3,
  Package,
  MessageCircle
} from 'lucide-react';

const FiberArtStore = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Ganesha Fiber Statue",
      price: 2500,
      originalPrice: 3200,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      category: "religious",
      rating: 4.8,
      reviews: 124,
      description: "Beautiful handcrafted Ganesha statue made from premium fiber materials. Perfect for home decoration and spiritual ambiance.",
      features: ["Handcrafted", "Weather Resistant", "Premium Fiber", "Eco-Friendly"],
      inStock: true,
      fastDelivery: true
    },
    {
      id: 2,
      name: "Modern Abstract Sculpture",
      price: 1800,
      originalPrice: 2200,
      image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400",
      category: "modern",
      rating: 4.6,
      reviews: 89,
      description: "Contemporary abstract fiber sculpture that adds elegance to any modern space.",
      features: ["Modern Design", "Lightweight", "Durable", "Easy to Clean"],
      inStock: true,
      fastDelivery: false
    },
    {
      id: 3,
      name: "Buddha Meditation Statue",
      price: 3200,
      originalPrice: 4000,
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
      category: "religious",
      rating: 4.9,
      reviews: 156,
      description: "Serene Buddha statue crafted with intricate details for meditation spaces and peaceful environments.",
      features: ["Handcrafted", "Premium Quality", "Meditation Focus", "Spiritual Design"],
      inStock: true,
      fastDelivery: true
    },
    {
      id: 4,
      name: "Animal Kingdom Lion",
      price: 2800,
      originalPrice: 3500,
      image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400",
      category: "animals",
      rating: 4.7,
      reviews: 93,
      description: "Majestic lion statue showcasing strength and beauty, perfect for home or office decoration.",
      features: ["Realistic Design", "Weather Proof", "High Detail", "Strong Build"],
      inStock: false,
      fastDelivery: false
    },
    {
      id: 5,
      name: "Floral Garden Sculpture",
      price: 1500,
      originalPrice: 1900,
      image: "https://images.unsplash.com/photo-1578662015144-54aae2481c40?w=400",
      category: "decorative",
      rating: 4.5,
      reviews: 67,
      description: "Elegant floral-themed sculpture that brings nature's beauty indoors.",
      features: ["Nature Inspired", "Colorful Design", "Indoor/Outdoor", "Easy Maintenance"],
      inStock: true,
      fastDelivery: true
    },
    {
      id: 6,
      name: "Vintage Classic Bust",
      price: 2200,
      originalPrice: 2800,
      image: "https://images.unsplash.com/photo-1594736797933-d0ae4ba2f29a?w=400",
      category: "vintage",
      rating: 4.4,
      reviews: 45,
      description: "Classic vintage-style bust that adds sophistication to any interior space.",
      features: ["Vintage Style", "Classic Design", "Premium Finish", "Timeless Appeal"],
      inStock: true,
      fastDelivery: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: '🎨' },
    { id: 'religious', name: 'Religious', icon: '🕉️' },
    { id: 'modern', name: 'Modern Art', icon: '🎭' },
    { id: 'animals', name: 'Animals', icon: '🦁' },
    { id: 'decorative', name: 'Decorative', icon: '🌺' },
    { id: 'vintage', name: 'Vintage', icon: '🏛️' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Header Component
  const Header = () => (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Radhe Fiber" className="h-8 w-8 rounded-lg" />
          <div>
            <h1 className="text-lg font-bold text-orange-600">Radhe Fiber</h1>
            <p className="text-xs text-gray-500">Art & Sculptures</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ShoppingCart 
              size={24} 
              className="text-orange-600 cursor-pointer"
              onClick={() => setCurrentView('cart')}
            />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <User size={24} className="text-orange-600 cursor-pointer" />
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for fiber art, statues..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Category Filter
  const CategoryFilter = () => (
    <div className="bg-white p-4 border-b border-gray-100">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );

  // Product Card
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setCurrentView('product');
          }}
        />
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm"
        >
          <Heart
            size={18}
            className={`${
              wishlist.find(item => item.id === product.id)
                ? 'text-red-500 fill-current'
                : 'text-gray-400'
            }`}
          />
        </button>
        {product.fastDelivery && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            Fast Delivery
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500">{product.reviews} reviews</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          </div>
          <span className="text-sm text-green-600 font-medium">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% off
          </span>
        </div>
        
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-2 px-4 rounded-xl font-medium transition-all ${
            product.inStock
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );

  // Product Detail View
  const ProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={() => setCurrentView('home')}>
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-semibold text-gray-800">Product Details</h1>
          <Share size={24} className="text-gray-700" />
        </div>

        <div className="overflow-y-auto">
          {/* Product Image */}
          <div className="relative">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-80 object-cover"
            />
            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-lg"
            >
              <Heart
                size={20}
                className={`${
                  wishlist.find(item => item.id === selectedProduct.id)
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h1>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(selectedProduct.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{selectedProduct.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{selectedProduct.reviews} reviews</span>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl font-bold text-orange-600">₹{selectedProduct.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-sm font-medium">
                {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% off
              </span>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                    <Award size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <Truck className="text-blue-500" size={20} />
                <span className="font-medium text-blue-700">Delivery Information</span>
              </div>
              <div className="space-y-1 text-sm text-blue-600">
                <p>Free delivery on orders above ₹2000</p>
                <p>Standard delivery: 5-7 business days</p>
                {selectedProduct.fastDelivery && <p>Express delivery available</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <button
              onClick={() => addToCart(selectedProduct)}
              disabled={!selectedProduct.inStock}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                selectedProduct.inStock
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Cart View
  const CartView = () => (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={() => setCurrentView('home')}>
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="font-semibold text-gray-800">Shopping Cart ({getTotalItems()})</h1>
        <div></div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <ShoppingCart size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Add some beautiful fiber art to get started</p>
          <button
            onClick={() => setCurrentView('home')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="p-4">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-orange-600 font-bold">₹{item.price}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-100 rounded-full"
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-100 rounded-full"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-orange-600 text-lg">₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/25">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );

  // Home View
  const HomeView = () => (
    <div className="bg-gray-50">
      <Header />
      <CategoryFilter />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 m-4 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Handcrafted Fiber Art</h2>
        <p className="text-orange-100 mb-4">Premium quality statues and home decor</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Shield size={16} />
            <span className="text-sm">Quality Assured</span>
          </div>
          <div className="flex items-center space-x-1">
            <Truck size={16} />
            <span className="text-sm">Free Delivery</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <Filter size={20} className="text-gray-600" />
        </div>
        
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'categories', icon: Grid3X3, label: 'Categories' },
          { id: 'cart', icon: ShoppingCart, label: 'Cart' },
          { id: 'orders', icon: Package, label: 'Orders' },
          { id: 'support', icon: MessageCircle, label: 'Support' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center py-2 px-3 ${
              currentView === item.id ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
            {item.id === 'cart' && getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {currentView === 'home' && <HomeView />}
      {currentView === 'product' && <ProductDetail />}
      {currentView === 'cart' && <CartView />}
      
      {/* Bottom Navigation - Show only on main views */}
      {['home', 'categories', 'cart', 'orders', 'support'].includes(currentView) && (
        <div className="pb-16">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default FiberArtStore;