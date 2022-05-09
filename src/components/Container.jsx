import { Box } from "@primer/react";

const Container = ({ children }) => (
  <Box
    display="grid"
    width="100%"
    height={"100vh"}
    backgroundColor="#8EC5FC"
    backgroundImage="linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
    sx={{
      placeItems: "center",
    }}
  >
    <Box
      display="flex"
      width="80%"
      height="90%"
      backgroundColor="white"
      borderRadius={24}
      overflow="auto"
    >
      {children}
    </Box>
  </Box>
);

export default Container;
