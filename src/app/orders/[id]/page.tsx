import { dataService } from "@/lib/dataService";
import Link from "next/link";
import { notFound } from "next/navigation";

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const order = await dataService.getOrderById(id);
  
  if (!order) {
    return notFound();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] items-center justify-center ">
      <div className="shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px] px-40 py-20">
      <h1 className="text-xl">Order Details</h1>
      <div className="mt-12 flex flex-col gap-6">
        <div className="">
          <span className="font-medium">Order Id: </span>
          <span>{order._id}</span>
        </div>
        <div className="">
          <span className="font-medium">Receiver Name: </span>
          <span>
            {order.buyerInfo?.firstName + " "}
            {order.buyerInfo?.lastName}
          </span>
        </div>
        <div className="">
          <span className="font-medium">Receiver Email: </span>
          <span>{order.buyerInfo?.email}</span>
        </div>
        <div className="">
          <span className="font-medium">Price: </span>
          <span>${order.totals?.total}</span>
        </div>
        <div className="">
          <span className="font-medium">Payment Status: </span>
          <span>{order.paymentStatus}</span>
        </div>
        <div className="">
          <span className="font-medium">Order Status: </span>
          <span>{order.fulfillmentStatus}</span>
        </div>
        <div className="">
          <span className="font-medium">Delivery Address: </span>
          <span>
            {order.billingInfo?.address?.street + " "}
            {order.billingInfo?.address?.city}
          </span>
        </div>
      </div>
      </div>
      <Link href="/" className="underline mt-6">
        Have a problem? Contact us
      </Link>
    </div>
  );
};

export default OrderPage;
