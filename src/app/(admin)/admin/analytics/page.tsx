"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dataService } from "@/lib/dataService";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    topProducts: [],
    ordersByStatus: {},
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [products, orders] = await Promise.all([
        dataService.getProducts(),
        dataService.getOrders()
      ]);

      const totalRevenue = orders.items.reduce((sum: number, order: any) => 
        sum + order.totals.total, 0
      );

      const totalOrders = orders.items.length;
      const totalProducts = products.items.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (mock data for demo)
      const revenueGrowth = 12.5;
      const ordersGrowth = 8.3;

      // Top products analysis
      const productSales: Record<string, { sales: number; revenue: number; name: string }> = {};
      
      orders.items.forEach((order: any) => {
        order.lineItems.forEach((item: any) => {
          const productName = item.productName.original;
          if (!productSales[productName]) {
            productSales[productName] = { sales: 0, revenue: 0, name: productName };
          }
          productSales[productName].sales += item.quantity;
          productSales[productName].revenue += item.totalPrice;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Orders by status
      const ordersByStatus: Record<string, number> = {};
      orders.items.forEach((order: any) => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      });

      // Monthly revenue (mock data for demo)
      const monthlyRevenue = [
        { month: "Jan", revenue: 12500 },
        { month: "Feb", revenue: 15200 },
        { month: "Mar", revenue: 18900 },
        { month: "Apr", revenue: 16700 },
        { month: "May", revenue: 21300 },
        { month: "Jun", revenue: totalRevenue }
      ];

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalProducts,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        topProducts,
        ordersByStatus,
        monthlyRevenue
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
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
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      growth: analytics.revenueGrowth,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toString(),
      icon: ShoppingCart,
      growth: analytics.ordersGrowth,
      color: "text-blue-600"
    },
    {
      title: "Average Order Value",
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      icon: BarChart3,
      growth: 5.2,
      color: "text-purple-600"
    },
    {
      title: "Total Products",
      value: analytics.totalProducts.toString(),
      icon: Package,
      growth: 0,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Business insights and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositiveGrowth = stat.growth > 0;
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
                {stat.growth !== 0 && (
                  <div className="flex items-center text-xs text-gray-600">
                    {isPositiveGrowth ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={isPositiveGrowth ? "text-green-600" : "text-red-600"}>
                      {Math.abs(stat.growth)}%
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
            <CardDescription>
              Best performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {analytics.topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Orders by Status
            </CardTitle>
            <CardDescription>
              Current order status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
                const percentage = analytics.totalOrders > 0 
                  ? ((count / analytics.totalOrders) * 100).toFixed(1)
                  : "0";
                
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "PENDING": return "bg-yellow-500";
                    case "PROCESSING": return "bg-blue-500";
                    case "SHIPPED": return "bg-purple-500";
                    case "FULFILLED": return "bg-green-500";
                    case "CANCELLED": return "bg-red-500";
                    default: return "bg-gray-500";
                  }
                };

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                        <span className="font-medium">{status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count} orders</span>
                        <Badge variant="outline">{percentage}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(analytics.ordersByStatus).length === 0 && (
                <p className="text-center text-gray-500 py-4">No orders data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Revenue Trend
          </CardTitle>
          <CardDescription>
            Revenue performance over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              {analytics.monthlyRevenue.map((data, index) => {
                const maxRevenue = Math.max(...analytics.monthlyRevenue.map(d => d.revenue));
                const height = (data.revenue / maxRevenue) * 200;
                
                return (
                  <div key={data.month} className="flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-lg flex items-end justify-center" style={{ height: "200px" }}>
                      <div 
                        className="w-12 bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}px` }}
                        title={`${data.month}: $${data.revenue.toFixed(2)}`}
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{data.month}</p>
                      <p className="text-xs text-gray-600">${data.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
