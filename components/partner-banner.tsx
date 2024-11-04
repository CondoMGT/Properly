"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Partner = {
  id: number;
  name: string;
  logo: string;
};

const partners: Partner[] = [
  {
    id: 1,
    name: "Acme Properties",
    logo: "",
  },
  {
    id: 2,
    name: "Zenith Real Estate",
    logo: "",
  },
  { id: 3, name: "Summit Homes", logo: "" },
  { id: 4, name: "Urban Living", logo: "" },
  {
    id: 5,
    name: "Coastal Rentals",
    logo: "",
  },
  {
    id: 6,
    name: "Mountain View Properties",
    logo: "",
  },
  {
    id: 7,
    name: "City Center Management",
    logo: "",
  },
  {
    id: 8,
    name: "Suburban Spaces",
    logo: "",
  },
  {
    id: 9,
    name: "Luxury Estates",
    logo: "",
  },
  {
    id: 10,
    name: "Green Living Apartments",
    logo: "",
  },
  {
    id: 11,
    name: "Historic Home Rentals",
    logo: "",
  },
  {
    id: 12,
    name: "Student Housing Solutions",
    logo: "",
  },
  {
    id: 13,
    name: "Corporate Suites",
    logo: "",
  },
  {
    id: 14,
    name: "Beachfront Bungalows",
    logo: "",
  },
  {
    id: 15,
    name: "Skyline Apartments",
    logo: "",
  },
  {
    id: 16,
    name: "Eco-Friendly Homes",
    logo: "",
  },
  {
    id: 17,
    name: "Senior Living Communities",
    logo: "",
  },
  {
    id: 18,
    name: "Vacation Rental Experts",
    logo: "",
  },
  {
    id: 19,
    name: "Downtown Lofts",
    logo: "",
  },
  {
    id: 20,
    name: "Family-Friendly Estates",
    logo: "",
  },
];

export const PartnerBanner = () => {
  const [visiblePartners, setVisiblePartners] = useState<Partner[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const width = window.innerWidth;
      let visibleCount;
      if (width < 640) visibleCount = 1;
      else if (width < 768) visibleCount = 2;
      else if (width < 1024) visibleCount = 3;
      else visibleCount = 4;

      setVisiblePartners(partners.slice(startIndex, startIndex + visibleCount));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [startIndex]);

  const scrollPartners = (direction: "left" | "right") => {
    setStartIndex((prevIndex) => {
      const newIndex = direction === "left" ? prevIndex - 1 : prevIndex + 1;
      return Math.max(
        0,
        Math.min(newIndex, partners.length - visiblePartners.length)
      );
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Our Trusted Partners
        </h2>
        <div className="relative">
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-custom-1 hover:bg-custom-1 text-secondary hover:text-secondary"
              onClick={() => scrollPartners("left")}
              disabled={startIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
            <div className="flex space-x-4 overflow-hidden">
              {visiblePartners.map((partner) => (
                <Card
                  key={partner.id}
                  className="w-48 flex-shrink-0 bg-custom-3"
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center h-40">
                    <Image
                      src={partner.logo || "/leo.png"}
                      alt={`${partner.name} logo`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <p className="text-sm font-medium text-center">
                      {partner.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-custom-1 hover:bg-custom-1 text-secondary hover:text-secondary"
              onClick={() => scrollPartners("right")}
              disabled={startIndex + visiblePartners.length === partners.length}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
