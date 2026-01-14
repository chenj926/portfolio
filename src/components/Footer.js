import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box backgroundColor="#f5f1e8" borderTop="1px solid #e2ddd2">
      <footer>
        <Flex
          margin="0 auto"
          px={12}
          color="#5d564d"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
          height={16}
        >
          <Text>Jialuo (Eric) Chen · © 2025</Text>
        </Flex>
      </footer>
    </Box>
  );
};
export default Footer;
