import Image from "next/image";

const Reviews = async ({ productId }: { productId: string }) => {
  // Mock reviews data for fake data approach
  const mockReviews = [
    {
      id: "1",
      customer: {
        avatar_url: "/profile.png",
        display_name: "John Doe"
      },
      rating: 5,
      heading: "Great product!",
      body: "I love this product. It's exactly what I was looking for.",
      media: []
    },
    {
      id: "2", 
      customer: {
        avatar_url: "/profile.png",
        display_name: "Jane Smith"
      },
      rating: 4,
      heading: "Good quality",
      body: "Nice quality product, would recommend to others.",
      media: []
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {mockReviews.map((review: any) => (
        <div className="flex flex-col gap-4" key={review.id}>
          {/* USER */}
          <div className="flex items-center gap-4 font-medium">
            <Image
              src={review.customer.avatar_url}
              alt=""
              width={32}
              height={32}
              className="rounded-full"
            />
            <span>{review.customer.display_name}</span>
          </div>
          {/* STARS */}
          <div className="flex gap-2">
            {Array.from({ length: review.rating }).map((_, index) => (
              <Image src="/star.png" alt="" key={index} width={16} height={16} />
            ))}
          </div>
          {/* DESC */}
          {review.heading && <p>{review.heading}</p>}
          {review.body && <p>{review.body}</p>}
          <div className="">
            {review.media.map((media: any) => (
              <Image
                src={media.url}
                key={media.id}
                alt=""
                width={100}
                height={50}
                className="object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
