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

const MotionBox = motion(Box);

const ContactMeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      backgroundColor="var(--bg-primary)"
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
          color="var(--accent-primary)"
          fontWeight="600"
        >
          Contact
        </Text>
        <Heading size="lg" color="var(--text-primary)">
          Let&apos;s Connect
        </Heading>
        <Text maxW="640px" color="var(--text-secondary)">
          Want to collaborate or chat? Send a note and I&apos;ll get back to you soon.
        </Text>
      </VStack>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
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
                  <FormLabel htmlFor="firstName" color="var(--text-primary)" fontSize="sm">
                    Name
                  </FormLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    bg="var(--glass-hover)"
                    border="1px solid var(--glass-border)"
                    color="var(--text-primary)"
                    _hover={{ borderColor: "var(--accent-border-strong)" }}
                    _focus={{
                      borderColor: "var(--accent-primary)",
                      boxShadow: "0 0 0 1px var(--accent-primary)",
                    }}
                    _placeholder={{ color: "var(--text-muted)" }}
                    {...formik.getFieldProps("firstName")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.firstName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                  <FormLabel htmlFor="email" color="var(--text-primary)" fontSize="sm">
                    Email
                  </FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    bg="var(--glass-hover)"
                    border="1px solid var(--glass-border)"
                    color="var(--text-primary)"
                    _hover={{ borderColor: "var(--accent-border-strong)" }}
                    _focus={{
                      borderColor: "var(--accent-primary)",
                      boxShadow: "0 0 0 1px var(--accent-primary)",
                    }}
                    _placeholder={{ color: "var(--text-muted)" }}
                    {...formik.getFieldProps("email")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.comment && formik.errors.comment}
                >
                  <FormLabel htmlFor="comment" color="var(--text-primary)" fontSize="sm">
                    Message
                  </FormLabel>
                  <Textarea
                    id="comment"
                    name="comment"
                    height={{ base: 140, md: 160 }}
                    bg="var(--glass-hover)"
                    border="1px solid var(--glass-border)"
                    color="var(--text-primary)"
                    _hover={{ borderColor: "var(--accent-border-strong)" }}
                    _focus={{
                      borderColor: "var(--accent-primary)",
                      boxShadow: "0 0 0 1px var(--accent-primary)",
                    }}
                    _placeholder={{ color: "var(--text-muted)" }}
                    {...formik.getFieldProps("comment")}
                  />
                  <FormErrorMessage color="#ef4444">{formik.errors.comment}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  width="full"
                  bg="var(--accent-gradient)"
                  color="white"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 30px var(--accent-border-strong)",
                  }}
                  transition="all 0.3s ease"
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
