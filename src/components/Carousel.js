import React, { useState, useEffect } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Card from "./Card";

const Carousel = ({ items, autoRotate = true, showDots = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dotStartIndex, setDotStartIndex] = useState(0); // For scrolling dots when >8

  const maxVisibleDots = 8;

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, isPaused, items.length]);

  // Handlers for navigation
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handleDotPrevious = () => {
    setDotStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleDotNext = () => {
    setDotStartIndex((prev) =>
      Math.min(prev + 1, items.length - maxVisibleDots)
    );
  };

  return (
    <Box
      position="relative"
      width="400px"
      height="300px"
      margin="0 auto"
    >
      {/* Left Button */}
      <Button
        aria-label="Previous"
        position="absolute"
        left="-60px" /* Moved outside the carousel */
        top="50%"
        transform="translateY(-50%)"
        onClick={handlePrevious}
        zIndex={2}
        bg="#DBD8CF"
        color="#303030"
        opacity="0.3"
        width="40px"
        height="80px"
      >
        <ChevronLeftIcon />
      </Button>

      {/* Slides */}
      {items.map((item, index) => (
        <Box
          key={index}
          position="absolute"
          top="0"
          left="0"
          width="calc(100% + 10px)" // Adjust card size to show neighboring cards
          height="100%"
          filter={
            index === activeIndex
              ? "none"
              : "blur(1px)" // Blur effect for non-active cards
          }
          
          transform={`translateX(${(index - activeIndex) * 100}%)`}
          transition="transform 0.5s ease"
          zIndex={index === activeIndex ? 1 : 0}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Card
            title={item.title}
            description={item.description}
            url={item.url || "#"}
          />
        </Box>
      ))}

      {/* Right Button */}
      <Button
        aria-label="Next"
        position="absolute"
        right="-60px" /* Moved outside the carousel */
        top="50%"
        transform="translateY(-50%)"
        onClick={handleNext}
        zIndex={2}
        bg="#DBD8CF"
        color="#303030"
        opacity="0.3"
        width="40px"
        height="80px"
      >
        <ChevronRightIcon />
      </Button>

    {/* Dot Navigation */}
    {showDots && (
    <HStack
        position="absolute"
        bottom="10px"
        left="50%"
        transform="translateX(-50%)"
        spacing={2}
        align="center"
        zIndex={2} // Ensure dots are above the slides
    >
        {/* Left Scroll Button for Dots */}
        {items.length > maxVisibleDots && dotStartIndex > 0 && (
        <Button
            size="sm"
            onClick={handleDotPrevious}
            bg="#303030"
            color="#DBD8CF"
            width="20px"
            height="20px"
            p={0}
            borderRadius="50%"
        >
            <ChevronLeftIcon boxSize="14px" />
        </Button>
        )}

        {/* Dots */}
        {items
        .slice(dotStartIndex, dotStartIndex + maxVisibleDots)
        .map((_, dotIndex) => {
            const globalIndex = dotStartIndex + dotIndex;
            return (
            <Box
                key={globalIndex}
                width="10px"
                height="10px"
                borderRadius="50%"
                bg={globalIndex === activeIndex ? "#ffffff" : "#888888"}
                cursor="pointer"
                onClick={() => setActiveIndex(globalIndex)}
            />
            );
        })}

        {/* Right Scroll Button for Dots */}
        {items.length > maxVisibleDots && dotStartIndex + maxVisibleDots < items.length && (
        <Button
            size="sm"
            onClick={handleDotNext}
            bg="#303030"
            color="#DBD8CF"
            width="20px"
            height="20px"
            p={0}
            borderRadius="50%"
        >
            <ChevronRightIcon boxSize="14px" />
        </Button>
        )}
    </HStack>
    )}
    </Box>
  );
};

export default Carousel;
