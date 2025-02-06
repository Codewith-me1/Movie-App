import { useEffect, useRef } from "react";

export const useCarousel = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      let isDragging = false;
      let startX = 0;
      let scrollLeft = 0;

      const handleTouchStart = (e: TouchEvent) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      };

      const handleTouchEnd = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
      };

      carousel.addEventListener("touchstart", handleTouchStart);
      carousel.addEventListener("touchend", handleTouchEnd);
      carousel.addEventListener("touchmove", handleTouchMove);

      return () => {
        carousel.removeEventListener("touchstart", handleTouchStart);
        carousel.removeEventListener("touchend", handleTouchEnd);
        carousel.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, []);

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 700, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -700, behavior: "smooth" });
    }
  };

  return { carouselRef, scrollRight, scrollLeft };
};
