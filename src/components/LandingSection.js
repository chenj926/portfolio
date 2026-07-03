import React from "react";
import { Box, Link } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import profilePic from "../assets/images/profile pic.jpg";
import LiquidGlass from "./LiquidGlass";
import "./HomeGlass.css";

const socials = [
  {
    icon: faEnvelope,
    label: "Email",
    url: "mailto:jialuo.chen@utoronto.ca",
  },
  {
    icon: faGithub,
    label: "GitHub",
    url: "https://github.com/chenj926",
  },
  {
    icon: faLinkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ericjialuochen/",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    url: "https://www.instagram.com/ericchen7161/",
  },
];

const statusOptions = [
  {
    key: "opportunity",
    label: "Open to opportunities",
    tone: "green",
  },
  {
    key: "collaborate",
    label: "Open to collaborate",
    tone: "blue",
  },
  {
    key: "communicate",
    label: "Open to communicate",
    tone: "pink",
  },
  {
    key: "vacation",
    label: "Currently on vacation",
    tone: "red",
  },
];

const activeStatusKeys = [
  "opportunity",
  "collaborate",
];

const avatarParticles = Array.from({ length: 64 }, (_, index) => ({
  angle: (index * 137.5) % 360,
  distance: 112 + (index % 8) * 9,
  size: 2 + (index % 5) * 0.7,
  duration: 3.2 + (index % 7) * 0.28,
  delay: (index % 12) * -0.22,
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.22,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const LandingSection = () => {
  const activeStatuses = statusOptions.filter((status) =>
    activeStatusKeys.includes(status.key)
  );

  return (
    <Box as="section" id="home-section" className="home-landing">
      <Box className="home-shell">
        <motion.div
          className="home-copy"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="home-eyebrow" variants={itemVariants}>
            AI Researcher &amp; Engineer
          </motion.p>

          <motion.h1 className="home-title" variants={itemVariants}>
            Jialuo (Eric) Chen <span>陈佳洛</span>
          </motion.h1>

          <motion.p className="home-lede" variants={itemVariants}>
            Industrial Engineering student with a dual focus on{" "}
            <strong>Machine Learning</strong> and{" "}
            <strong>Software Architecture</strong>. I thrive at the intersection
            of complex algorithms and intuitive product design.
          </motion.p>

          <LiquidGlass
            as={motion.div}
            className="home-current"
            variants={itemVariants}
            displacementScale={64}
            blurAmount={0.08}
            saturation={132}
            aberrationIntensity={2}
            elasticity={0.18}
            cornerRadius={28}
          >
            <p>
              Currently engineering risk platforms at <strong>JANA Corp</strong>,
              researching <strong>Bayesian Optimization Machine Learning</strong> at{" "}
              <a
                href="https://www.utoronto.ca/"
                target="_blank"
                rel="noreferrer"
              >
                UofT
              </a>{" "}
              and <strong>AI Reasoning</strong> at{" "}
              <a href="https://www.sjtu.edu.cn/" target="_blank" rel="noreferrer">
                SJTU
              </a>
              . Open to <strong>AI Engineering</strong> or{" "}
              <strong>AI/ML Research</strong> roles.
            </p>
          </LiquidGlass>

          <motion.div className="home-social-row" variants={itemVariants}>
            {socials.map((social) => (
              <LiquidGlass
                as={Link}
                key={social.label}
                href={social.url}
                isExternal
                className="home-social-pill"
                displacementScale={64}
                blurAmount={0.1}
                saturation={130}
                aberrationIntensity={2}
                elasticity={0.35}
                cornerRadius={999}
                padding="0"
              >
                <FontAwesomeIcon icon={social.icon} />
                <span>{social.label}</span>
              </LiquidGlass>
            ))}
          </motion.div>

          <motion.div className="home-connect-row" variants={itemVariants}>
            <button
              className="home-connect-button"
              type="button"
              onClick={() =>
                document
                  .getElementById("connect-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <span>Let&apos;s connect</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-profile-wrap"
          initial={{ opacity: 0, x: 48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" }}
        >
          <LiquidGlass
            className="home-profile-card"
            displacementScale={64}
            blurAmount={0.075}
            saturation={138}
            aberrationIntensity={1.8}
            elasticity={0.15}
            cornerRadius={34}
          >
            <div className="home-avatar-stage">
              <span className="home-avatar-halo" aria-hidden="true" />
              <span className="home-avatar-rim" aria-hidden="true" />
              <div className="home-avatar-particles" aria-hidden="true">
                {avatarParticles.map((particle, index) => (
                  <span
                    key={index}
                    style={{
                      "--particle-angle": `${particle.angle}deg`,
                      "--particle-distance": `${particle.distance}px`,
                      "--particle-size": `${particle.size}px`,
                      "--particle-duration": `${particle.duration}s`,
                      "--particle-delay": `${particle.delay}s`,
                    }}
                  />
                ))}
              </div>
              <img
                src={profilePic}
                alt="Jialuo (Eric) Chen"
                className="home-avatar"
              />
            </div>

            <h2>Software &amp; AI/ML Engineer</h2>
            <p className="home-profile-subtitle">
              Industrial Engineering &middot; University of Toronto
            </p>

            <div className="home-status-grid">
              {activeStatuses.map((status) => (
                <LiquidGlass
                  key={status.key}
                  className={`home-status-chip is-${status.tone}`}
                  displacementScale={64}
                  blurAmount={0.1}
                  saturation={130}
                  aberrationIntensity={2}
                  elasticity={0.28}
                  cornerRadius={999}
                  padding="0"
                >
                  <span className="home-status-dot" />
                  <span>{status.label}</span>
                </LiquidGlass>
              ))}
            </div>
          </LiquidGlass>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LandingSection;
