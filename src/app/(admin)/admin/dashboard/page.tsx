"use client";

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Eye
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCategories: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCategories: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Fetching dashboard data...');
      try {
        const [products, orders, categories] = await Promise.all([
          apiClient.getProducts({ limit: 100 }),
          apiClient.getOrders({ limit: 100 }),
          apiClient.getCategories({ limit: 100 })
        ]);

        const totalRevenue = orders.orders.reduce((sum: number, order: any) => 
          sum + order.totalAmount, 0
        );

        const lowStockProducts = products.products.filter((product: any) => 
          product.stockQuantity < 10
        );

        const recentOrders = orders.orders
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalProducts: products.products.length,
          totalOrders: orders.orders.length,
          totalRevenue,
          totalCategories: categories.categories.length,
          recentOrders,
          lowStockProducts
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products in catalog",
      color: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders received",
      color: "text-green-600"
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Total revenue generated",
      color: "text-yellow-600"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Users,
      description: "Product categories",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your ShoesX admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Latest orders from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                    <Badge variant={
                      order.status === "DELIVERED" ? "default" : 
                      order.status === "PENDING" ? "secondary" : "destructive"
                    }>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-center text-gray-500 py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              Products running low on inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.sku || product.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      {product.stockQuantity} left
                    </Badge>
                  </div>
                </div>
              ))}
              {stats.lowStockProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">All products well stocked</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/admin/products" 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Manage Products</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove products</p>
            </Link>
            <Link 
              href="/admin/categories" 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Manage Categories</h3>
              <p className="text-sm text-gray-600">Organize product categories</p>
            </Link>
            <Link 
              href="/admin/orders" 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">View Orders</h3>
              <p className="text-sm text-gray-600">Process customer orders</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
