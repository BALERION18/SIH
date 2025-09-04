import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import monasteryImage1 from "@/assets/monastery-1.jpg";
import monasteryImage2 from "@/assets/monastery-2.jpg";
import monasteryImage3 from "@/assets/monastery-3.jpg";

const carouselData = [
  {
    id: 1,
    image: monasteryImage1,
    title: "Rumtek Monastery",
    description: "The largest monastery in Sikkim and seat of the Karmapa",
    location: "East Sikkim",
  },
  {
    id: 2,
    image: monasteryImage2,
    title: "Enchey Monastery",
    description: "200-year-old monastery with stunning mountain views",
    location: "Gangtok",
  },
  {
    id: 3,
    image: monasteryImage3,
    title: "Pemayangtse Monastery",
    description: "One of the oldest monasteries in Sikkim",
    location: "West Sikkim",
  },
];

export const SikkimCarousel = () => {
  const [api, setApi] = useState(null);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {carouselData.map((item, index) => (
            <CarouselItem key={item.id}>
              <div className="relative h-[400px] rounded-xl overflow-hidden group shadow-monastery">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-2 text-sm text-primary-glow">
                      <span className="w-2 h-2 bg-primary-glow rounded-full animate-glow-pulse" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-white text-sm">{item.description}</p>

                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      
    </div>
  );
};
