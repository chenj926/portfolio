import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import * as Yup from "yup";
import FullScreenSection from "./FullScreenSection";
import { useTheme } from "../context/themeContext";

const MotionBox = motion(Box);

const ContactMeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      comment: "",
    },
    onSubmit: (values, { resetForm }) => {
      const mailtoLink = `mailto:jialuo.chen@mail.utoronto.ca?subject=Let%27s%20Connect&body=Name:%20${encodeURIComponent(
        values.firstName
      )}%0AEmail:%20${encodeURIComponent(
        values.email
      )}%0A%0AMessage:%0A${encodeURIComponent(values.comment)}`;

      window.location.href = mailtoLink;
      resetForm();
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      comment: Yup.string().required("Required"),
    }),
  });

  return (
    <FullScreenSection
      id="connect-section"
      backgroundColor={isDarkMode ? "#0a0a0f" : "#faf8f5"}
      py={{ base: 12, md: 20 }}
      px={{ base: 6, md: 12 }}
      spacing={8}
      alignItems="stretch"
    >
      <VStack align="flex-start" spacing={3}>
        <Text
          fontSize="sm"
          textTransform="uppercase"
          letterSpacing="0.2em"
          color={isDarkMode ? "#6366f1" : "#8b6914"}
          fontWeight="600"
        >
          Contact
        </Text>
        <Heading size="lg" color={isDarkMode ? "#f0f0f5" : "#2d2a26"}>
          Let&apos;s Connect
        </Heading>
        <Text maxW="640px" color={isDarkMode ? "#8b8b9a" : "#5c574e"}>
          Want to collaborate or chat? Send a note and I&apos;ll get back to you soon.
        </Text>
      </VStack>

      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Box
          className={`envelope ${isOpen ? "is-open" : ""}`}
          maxW={{ base: "100%", md: "640px" }}
          alignSelf="center"
        >
          <Box className="envelope-flap" />
          <Box className="envelope-body">
            <Button
              className="envelope-seal"
              onClick={() => setIsOpen((prev) => !prev)}
              variant="unstyled"
              aria-expanded={isOpen}
            >
              {isOpen ? "Close" : "Open to Connect"}
            </Button>
          </Box>
          <Box className="envelope-letter">
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4}>
                <FormControl
                  isInvalid={formik.touched.firstName && formik.errors.firstName}
                >
                  <FormLabel htmlFor="firstName" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontSize="sm">
                    Name
                  </FormLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    bg={isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)"}
                    border={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(139, 90, 43, 0.15)"}`}
                    color={isDarkMode ? "#f0f0f5" : "#2d2a26"}
                    _hover={{ borderColor: isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(139, 105, 20, 0.4)" }}
                    _focus={{
                      borderColor: isDarkMode ? "#6366f1" : "#8b6914",
                      boxShadow: isDarkMode ? "0 0 0 1px #6366f1" : "0 0 0 1px #8b6914",
                    }}
                    _placeholder={{ color: isDarkMode ? "#5a5a6e" : "#8a847a" }}
                    {...formik.getFieldProps("firstName")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.firstName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                  <FormLabel htmlFor="email" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontSize="sm">
                    Email
                  </FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    bg={isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)"}
                    border={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(139, 90, 43, 0.15)"}`}
                    color={isDarkMode ? "#f0f0f5" : "#2d2a26"}
                    _hover={{ borderColor: isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(139, 105, 20, 0.4)" }}
                    _focus={{
                      borderColor: isDarkMode ? "#6366f1" : "#8b6914",
                      boxShadow: isDarkMode ? "0 0 0 1px #6366f1" : "0 0 0 1px #8b6914",
                    }}
                    _placeholder={{ color: isDarkMode ? "#5a5a6e" : "#8a847a" }}
                    {...formik.getFieldProps("email")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.comment && formik.errors.comment}
                >
                  <FormLabel htmlFor="comment" color={isDarkMode ? "#f0f0f5" : "#2d2a26"} fontSize="sm">
                    Message
                  </FormLabel>
                  <Textarea
                    id="comment"
                    name="comment"
                    height={{ base: 140, md: 160 }}
                    bg={isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.7)"}
                    border={`1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(139, 90, 43, 0.15)"}`}
                    color={isDarkMode ? "#f0f0f5" : "#2d2a26"}
                    _hover={{ borderColor: isDarkMode ? "rgba(99, 102, 241, 0.4)" : "rgba(139, 105, 20, 0.4)" }}
                    _focus={{
                      borderColor: isDarkMode ? "#6366f1" : "#8b6914",
                      boxShadow: isDarkMode ? "0 0 0 1px #6366f1" : "0 0 0 1px #8b6914",
                    }}
                    _placeholder={{ color: isDarkMode ? "#5a5a6e" : "#8a847a" }}
                    {...formik.getFieldProps("comment")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.comment}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  width="full"
                  bg={isDarkMode
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "linear-gradient(135deg, #8b6914, #a67c00)"
                  }
                  color="white"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: isDarkMode
                      ? "0 10px 30px rgba(99, 102, 241, 0.4)"
                      : "0 10px 30px rgba(139, 105, 20, 0.3)",
                  }}
                  transition="all 0.4s ease"
                >
                  Send message
                </Button>
              </VStack>
            </form>
          </Box>
        </Box>
      </MotionBox>
    </FullScreenSection>
  );
};

export default ContactMeSection;
