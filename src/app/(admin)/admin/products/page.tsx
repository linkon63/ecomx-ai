"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { dataService } from "@/lib/dataService";
import { Plus, Edit, Trash2, Package, Search, Filter } from "lucide-react";

interface Product {
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
  };
  collections: string[];
  stock: {
    inStock: boolean;
    quantity: number;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    imageUrl: "",
    collections: [] as string[],
    stock: {
      inStock: true,
      quantity: 0
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.collections.includes(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories()
      ]);
      setProducts(productsRes.items);
      setCategories(categoriesRes.items);
      setFilteredProducts(productsRes.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discountedPrice: "",
      imageUrl: "",
      collections: [],
      stock: {
        inStock: true,
        quantity: 0
      }
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      _id: editingProduct?._id || `prod_${Date.now()}`,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      price: {
        price: parseFloat(formData.price),
        discountedPrice: parseFloat(formData.discountedPrice) || parseFloat(formData.price)
      },
      media: {
        mainMedia: {
          image: {
            url: formData.imageUrl || "/placeholder-product.jpg"
          }
        }
      },
      collections: formData.collections,
      stock: formData.stock
    };

    if (editingProduct) {
      const updatedProducts = products.map(prod => 
        prod._id === editingProduct._id ? productData : prod
      );
      setProducts(updatedProducts);
    } else {
      setProducts([...products, productData]);
    }

    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.price.toString(),
      discountedPrice: product.price.discountedPrice.toString(),
      imageUrl: product.media.mainMedia.image.url,
      collections: product.collections,
      stock: product.stock
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter(prod => prod._id !== productId));
  };

  const handleCategoryToggle = (categorySlug: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        collections: [...prev.collections, categorySlug]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        collections: prev.collections.filter(cat => cat !== categorySlug)
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Create New Product"}
              </DialogTitle>
              <DialogDescription>
                Add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Nike Air Max 270"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product description..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="99.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountedPrice: e.target.value }))}
                    placeholder="79.99"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.stock.quantity}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stock: { ...prev.stock, quantity: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="100"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.stock.inStock}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      stock: { ...prev.stock, inStock: checked as boolean }
                    }))}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label className="text-base font-medium">Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category._id}
                        checked={formData.collections.includes(category.slug)}
                        onCheckedChange={(checked) => handleCategoryToggle(category.slug, checked as boolean)}
                      />
                      <Label htmlFor={category._id} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Products
          </CardTitle>
          <CardDescription>
            {filteredProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.media.mainMedia.image.url}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 max-w-xs truncate">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {product.price.price !== product.price.discountedPrice ? (
                        <>
                          <p className="font-medium text-green-600">
                            ${product.price.discountedPrice}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            ${product.price.price}
                          </p>
                        </>
                      ) : (
                        <p className="font-medium">${product.price.price}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.stock.inStock ? "default" : "destructive"}>
                        {product.stock.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        ({product.stock.quantity})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.collections.map((collection) => {
                        const category = categories.find(cat => cat.slug === collection);
                        return (
                          <Badge key={collection} variant="outline" className="text-xs">
                            {category?.name || collection}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || selectedCategory !== "all" 
                ? "No products match your filters." 
                : "No products found. Create your first product to get started."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
