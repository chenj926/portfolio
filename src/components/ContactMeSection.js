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
import * as Yup from "yup";
import FullScreenSection from "./FullScreenSection";

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
      backgroundColor="#f5f1e8"
      py={{ base: 12, md: 20 }}
      px={{ base: 6, md: 12 }}
      spacing={8}
      alignItems="stretch"
    >
      <VStack align="flex-start" spacing={4}>
        <Heading size="lg">Let&apos;s Connect</Heading>
        <Text maxW="640px" color="#5d564d">
          Want to collaborate or chat? Send a note and I&apos;ll get back to you soon.
        </Text>
      </VStack>
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
            Connect
          </Button>
        </Box>
        <Box className="envelope-letter">
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
              <FormControl
                isInvalid={formik.touched.firstName && formik.errors.firstName}
              >
                <FormLabel htmlFor="firstName">Name</FormLabel>
                <Input id="firstName" name="firstName" {...formik.getFieldProps("firstName")} />
                <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" name="email" type="email" {...formik.getFieldProps("email")} />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formik.touched.comment && formik.errors.comment}
              >
                <FormLabel htmlFor="comment">Message</FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  height={{ base: 140, md: 180 }}
                  {...formik.getFieldProps("comment")}
                />
                <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                backgroundColor="#3d3b36"
                color="#f5f1e8"
                width="full"
                _hover={{ backgroundColor: "#2f2c28" }}
              >
                Send message
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </FullScreenSection>
  );
};

export default ContactMeSection;
