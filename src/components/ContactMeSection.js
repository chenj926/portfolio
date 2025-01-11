import React from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import FullScreenSection from "./FullScreenSection";

const LandingSection = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      comment: "",
    },
    onSubmit: (values, { resetForm }) => {
      // Construct the mailto URL
      const mailtoLink = `mailto:jialuo.chen@mail.utoronto.ca?subject=Contact%20Form%20Submission&body=Name:%20${encodeURIComponent(
        values.firstName
      )}%0AEmail:%20${encodeURIComponent(
        values.email
      )}%0A%0AMessage:%0A${encodeURIComponent(values.comment)}`;
      
      // Open the mailto link
      window.location.href = mailtoLink;

      // Reset the form fields
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
      isDarkBackground
      backgroundColor="#4B6B8A"
      py={16}
      spacing={8}
    >
      <VStack p={{ base: 4, md: 32 }} alignItems="center" width="80%">
        <Heading as="h1" id="contactme-section" color="#DBD8CF">
          Contact me
        </Heading>
        <Box
          p={6}
          rounded="md"
          w="100%"
          maxW={{ base: "90%", sm: "480px", lg: "600px" }} // Fluid width for different screens
        >
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
              <FormControl
                isInvalid={formik.touched.firstName && formik.errors.firstName}
              >
                <FormLabel htmlFor="firstName" color="#DBD8CF">
                  Name
                </FormLabel>
                <Input
                  id="firstName"
                  name="firstName"
                  {...formik.getFieldProps("firstName")}
                  width="100%" // Ensure the input spans full width
                />
                <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel htmlFor="email" color="#DBD8CF">
                  Email Address
                </FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  width="100%" // Ensure the input spans full width
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formik.touched.comment && formik.errors.comment}
              >
                <FormLabel htmlFor="comment" color="#DBD8CF">
                  Your message
                </FormLabel>
                <Textarea
                  id="comment"
                  name="comment"
                  height={{ base: 150, md: 250 }} // Dynamic height for different screen sizes
                  color="#DBD8CF"
                  {...formik.getFieldProps("comment")}
                  width="100%" // Ensure the textarea spans full width
                />
                <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                backgroundColor="#DBD8CF"
                color="#303030"
                width="full"
                _hover={{ backgroundColor: "#C1BFB4" }}
              >
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </FullScreenSection>
  );
};

export default LandingSection;
