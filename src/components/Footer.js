import React from "react";
import {Box, Flex} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box backgroundColor="#303030">
      <footer>
        <Flex
          margin="0 auto"
          px={12}
          color="white"
          justifyContent="center"
          alignItems="center"
          maxWidth="1024px"
          height={16}
        >
          <p color="#DBD8CF"> Jialuo (Eric) Chen • © 2025</p>
        </Flex>
      </footer>
    </Box>
  );
};
export default Footer;
