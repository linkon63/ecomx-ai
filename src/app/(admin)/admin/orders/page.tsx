"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dataService } from "@/lib/dataService";
import { ShoppingCart, Search, Eye, Package, Truck, CheckCircle } from "lucide-react";

interface Order {
  _id: string;
  number: string;
  dateCreated: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "FULFILLED" | "CANCELLED";
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  billingInfo: {
    contactDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    address: {
      addressLine: string;
      city: string;
      subdivision: string;
      country: string;
      postalCode: string;
    };
  };
  lineItems: Array<{
    _id: string;
    productName: {
      original: string;
    };
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.billingInfo.contactDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.billingInfo.contactDetails.firstName} ${order.billingInfo.contactDetails.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await dataService.getOrders();
      setOrders(response.items);
      setFilteredOrders(response.items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "outline";
      case "FULFILLED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Package className="h-4 w-4" />;
      case "PROCESSING":
        return <Package className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "FULFILLED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
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
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, customers, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            All Orders
          </CardTitle>
          <CardDescription>
            {filteredOrders.length} of {orders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">#{order.number}</p>
                      <p className="text-sm text-gray-500">
                        {order.lineItems.length} item(s)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.billingInfo.contactDetails.firstName} {order.billingInfo.contactDetails.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.billingInfo.contactDetails.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(order.dateCreated).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.dateCreated).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">${order.totals.total.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - #{order.number}</DialogTitle>
                            <DialogDescription>
                              Complete order information and items
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Order Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Order Information</h4>
                                  <p className="text-sm text-gray-600">Order ID: {selectedOrder._id}</p>
                                  <p className="text-sm text-gray-600">
                                    Date: {new Date(selectedOrder.dateCreated).toLocaleString()}
                                  </p>
                                  <div className="mt-2">
                                    <Badge variant={getStatusColor(selectedOrder.status)}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Customer Information</h4>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.billingInfo.contactDetails.firstName} {selectedOrder.billingInfo.contactDetails.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.billingInfo.contactDetails.email}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.billingInfo.contactDetails.phone}
                                  </p>
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div>
                                <h4 className="font-medium mb-2">Shipping Address</h4>
                                <div className="text-sm text-gray-600">
                                  <p>{selectedOrder.billingInfo.address.addressLine}</p>
                                  <p>
                                    {selectedOrder.billingInfo.address.city}, {selectedOrder.billingInfo.address.subdivision} {selectedOrder.billingInfo.address.postalCode}
                                  </p>
                                  <p>{selectedOrder.billingInfo.address.country}</p>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-medium mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {selectedOrder.lineItems.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center p-3 border rounded">
                                      <div>
                                        <p className="font-medium">{item.productName.original}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order Totals */}
                              <div className="border-t pt-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${selectedOrder.totals.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>${selectedOrder.totals.shipping.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>${selectedOrder.totals.tax.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span>${selectedOrder.totals.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Status Update */}
                              <div>
                                <h4 className="font-medium mb-2">Update Status</h4>
                                <Select
                                  value={selectedOrder.status}
                                  onValueChange={(value) => updateOrderStatus(selectedOrder._id, value as Order["status"])}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="PROCESSING">Processing</SelectItem>
                                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                                    <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order._id, value as Order["status"])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "No orders match your filters." 
                : "No orders found."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
