import React, { useState, useEffect, useRef } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useReducedMotion } from "framer-motion";
import Card from "./Card";

const Carousel = ({ items, autoRotate = false, showDots = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [motionlessNavigation, setMotionlessNavigation] = useState(false);
  const [dotStartIndex, setDotStartIndex] = useState(0); // For scrolling dots when >8
  const carouselRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const maxVisibleDots = 8;

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!carouselRef.current || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isPaused || shouldReduceMotion || !isInView || !pageVisible) {
      return undefined;
    }

    const interval = setInterval(() => {
      setMotionlessNavigation(false);
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRotate, isInView, isPaused, items.length, pageVisible, shouldReduceMotion]);

  // Handlers for navigation
  const handlePrevious = (event) => {
    setMotionlessNavigation(event.detail === 0);
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = (event) => {
    setMotionlessNavigation(event.detail === 0);
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
      ref={carouselRef}
      position="relative"
      width="400px"
      height="300px"
      margin="0 auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      {autoRotate && !shouldReduceMotion && (
        <Button
          size="xs"
          position="absolute"
          top="8px"
          right="8px"
          zIndex={3}
          onClick={(event) => {
            setMotionlessNavigation(event.detail === 0);
            setIsPaused((paused) => !paused);
          }}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
      )}
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
          transition={
            shouldReduceMotion || motionlessNavigation
              ? "none"
              : "transform 220ms cubic-bezier(0.77, 0, 0.175, 1)"
          }
          zIndex={index === activeIndex ? 1 : 0}
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
                role="button"
                tabIndex={0}
                aria-label={`Show slide ${globalIndex + 1}`}
                onClick={(event) => {
                  setMotionlessNavigation(event.detail === 0);
                  setActiveIndex(globalIndex);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setMotionlessNavigation(true);
                    setActiveIndex(globalIndex);
                  }
                }}
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
