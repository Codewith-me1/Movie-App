import React from "react";
import { ArrowBigRight } from "lucide-react";
import { useEffect } from "react";

// useEffect(() => {
//   const carousel = carouselRef.current;
//   let isDragging = false;
//   let startX = 0;
//   let scrollLeft = 0;

//   const handleMouseDown = (e) => {
//     isDragging = true;
//     carousel.classList.add("dragging");
//     startX = e.pageX - carousel.offsetLeft;
//     scrollLeft = carousel.scrollLeft;
//   };

//   const handleMouseLeave = () => {
//     isDragging = false;
//     carousel.classList.remove("dragging");
//   };

//   const handleMouseUp = () => {
//     isDragging = false;
//     carousel.classList.remove("dragging");
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging) return;
//     e.preventDefault(); // Prevent text/image selection
//     const x = e.pageX - carousel.offsetLeft;
//     const walk = (x - startX) * 1.5; // Adjust scrolling speed
//     carousel.scrollLeft = scrollLeft - walk;
//   };

//   if (carousel) {
//     carousel.addEventListener("mousedown", handleMouseDown);
//     carousel.addEventListener("mouseleave", handleMouseLeave);
//     carousel.addEventListener("mouseup", handleMouseUp);
//     carousel.addEventListener("mousemove", handleMouseMove);
//   }

//   return () => {
//     if (carousel) {
//       carousel.removeEventListener("mousedown", handleMouseDown);
//       carousel.removeEventListener("mouseleave", handleMouseLeave);
//       carousel.removeEventListener("mouseup", handleMouseUp);
//       carousel.removeEventListener("mousemove", handleMouseMove);
//     }
//   };
// }, []);

interface Props {
  onclick: () => void;
}

const Carousel = ({onclick}:Props) => {
  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleScrollRight}
      className="absolute text-center p-[0.8rem] right-5 top-1/2  bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
    >
      <ArrowBigRight size={30} />
    </button>
  );
};

export default Carousel;
