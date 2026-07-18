import React, { useEffect, useRef, useState } from "react";
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
import { useReducedMotion } from "framer-motion";
import * as Yup from "yup";
import FullScreenSection from "./FullScreenSection";
import "./ContactEnvelope.css";

const OPEN_FOCUS_DELAY = 300;
const CLOSE_FOCUS_DELAY = 270;

const ContactMeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [motionlessAction, setMotionlessAction] = useState(false);
  const nameInputRef = useRef(null);
  const openButtonRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const focusTimerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      comment: "",
    },
    onSubmit: (values, { resetForm }) => {
      const mailtoLink = `mailto:jialuo.chen@utoronto.ca?subject=Let%27s%20Connect&body=Name:%20${encodeURIComponent(
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

  useEffect(() => {
    const clearFocusTimer = () => {
      if (focusTimerRef.current) {
        window.clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
    };

    clearFocusTimer();

    if (isOpen) {
      hasOpenedRef.current = true;
      focusTimerRef.current = window.setTimeout(
        () => {
          nameInputRef.current?.focus({ preventScroll: true });
          focusTimerRef.current = null;
        },
        shouldReduceMotion || motionlessAction ? 0 : OPEN_FOCUS_DELAY
      );
    } else if (hasOpenedRef.current) {
      focusTimerRef.current = window.setTimeout(
        () => {
          openButtonRef.current?.focus({ preventScroll: true });
          focusTimerRef.current = null;
        },
        shouldReduceMotion || motionlessAction ? 0 : CLOSE_FOCUS_DELAY
      );
    }

    return clearFocusTimer;
  }, [isOpen, motionlessAction, shouldReduceMotion]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMotionlessAction(true);
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

      <Box>
        <Box
          className={`contact-envelope ${isOpen ? "is-open" : "is-closed"} ${
            motionlessAction ? "is-motionless" : ""
          }`}
          aria-label={isOpen ? "Open contact letter" : "Closed contact envelope"}
        >
          <div className="contact-envelope-stage">
            <div className="contact-envelope-base" aria-hidden="true">
              <div className="contact-envelope-back" />
              <div className="contact-envelope-flap" />
              <div className="contact-envelope-front" />
            </div>

            <button
              ref={openButtonRef}
              type="button"
              className="contact-envelope-seal"
              aria-expanded={isOpen}
              aria-controls="contact-letter-panel"
              aria-hidden={isOpen}
              disabled={isOpen}
              tabIndex={isOpen ? -1 : 0}
              onClick={(event) => {
                setMotionlessAction(event.detail === 0);
                setIsOpen(true);
              }}
            >
              <span className="contact-envelope-seal-mark" aria-hidden="true">
                EC
              </span>
              <span>Open to connect</span>
            </button>

            <div
              id="contact-letter-panel"
              className="contact-envelope-letter"
              aria-hidden={!isOpen}
            >
              <div className="contact-letter-heading">
                <div>
                  <Text className="contact-letter-kicker">A personal note</Text>
                  <Heading as="h3" size="md" className="contact-letter-title">
                    Write to Eric
                  </Heading>
                </div>
                <button
                  type="button"
                  className="contact-letter-close"
                  aria-label="Close contact letter"
                  disabled={!isOpen}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={(event) => {
                    setMotionlessAction(event.detail === 0);
                    setIsOpen(false);
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <form
                className="contact-letter-form"
                aria-hidden={!isOpen}
                onSubmit={formik.handleSubmit}
              >
                <VStack spacing={3} align="stretch">
                  <FormControl
                    isDisabled={!isOpen}
                    isInvalid={formik.touched.firstName && formik.errors.firstName}
                  >
                    <FormLabel htmlFor="firstName" className="contact-letter-label">
                      Name
                    </FormLabel>
                    <Input
                      ref={nameInputRef}
                      id="firstName"
                      name="firstName"
                      className="contact-letter-input"
                      isDisabled={!isOpen}
                      tabIndex={isOpen ? 0 : -1}
                      bg="var(--contact-letter-field)"
                      border="1px solid var(--contact-letter-line)"
                      color="var(--contact-letter-ink)"
                      _focusVisible={{
                        borderColor: "var(--accent-primary)",
                        boxShadow: "0 0 0 2px var(--accent-border-strong)",
                      }}
                      {...formik.getFieldProps("firstName")}
                    />
                    <FormErrorMessage className="contact-letter-error">
                      {formik.errors.firstName}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isDisabled={!isOpen}
                    isInvalid={formik.touched.email && formik.errors.email}
                  >
                    <FormLabel htmlFor="email" className="contact-letter-label">
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="contact-letter-input"
                      isDisabled={!isOpen}
                      tabIndex={isOpen ? 0 : -1}
                      bg="var(--contact-letter-field)"
                      border="1px solid var(--contact-letter-line)"
                      color="var(--contact-letter-ink)"
                      _focusVisible={{
                        borderColor: "var(--accent-primary)",
                        boxShadow: "0 0 0 2px var(--accent-border-strong)",
                      }}
                      {...formik.getFieldProps("email")}
                    />
                    <FormErrorMessage className="contact-letter-error">
                      {formik.errors.email}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isDisabled={!isOpen}
                    isInvalid={formik.touched.comment && formik.errors.comment}
                  >
                    <FormLabel htmlFor="comment" className="contact-letter-label">
                      Message
                    </FormLabel>
                    <Textarea
                      id="comment"
                      name="comment"
                      className="contact-letter-textarea"
                      isDisabled={!isOpen}
                      tabIndex={isOpen ? 0 : -1}
                      resize="none"
                      minH={{ base: "104px", md: "118px" }}
                      bg="var(--contact-letter-field)"
                      border="1px solid var(--contact-letter-line)"
                      color="var(--contact-letter-ink)"
                      _focusVisible={{
                        borderColor: "var(--accent-primary)",
                        boxShadow: "0 0 0 2px var(--accent-border-strong)",
                      }}
                      {...formik.getFieldProps("comment")}
                    />
                    <FormErrorMessage className="contact-letter-error">
                      {formik.errors.comment}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    className="contact-letter-submit"
                    isDisabled={!isOpen}
                    tabIndex={isOpen ? 0 : -1}
                    width="full"
                    bg="var(--accent-gradient)"
                    color="#fff9ed"
                    fontWeight="700"
                  >
                    Send message
                  </Button>
                </VStack>
              </form>
            </div>
          </div>
        </Box>
      </Box>
    </FullScreenSection>
  );
};

export default ContactMeSection;
