import { Box, IconButton } from "@primer/react";
import {
  PaperAirplaneIcon,
  MailIcon,
  ListUnorderedIcon,
} from "@primer/octicons-react";

const Nav = ({onChange}) => {

  const handleClick = (page) => () => onChange(page);

  return (
    <Box
      display="flex"
      width={64}
      height="100%"
      flexDirection="column"
      borderColor="#80808021"
      borderRightWidth={1}
      borderRightStyle="solid"
      borderTopLeftRadius={24}
      borderBottomLeftRadius={24}
    >
      <IconButton
        onClick={handleClick("sendMessage")}
        variant="invisible"
        icon={PaperAirplaneIcon}
        sx={{
          height: 64,
          width: 64,
          "& svg": {
            height: 20,
            width: 20,
          },
        }}
      />
      <IconButton
        onClick={handleClick("templates")}
        variant="invisible"
        icon={MailIcon}
        sx={{
          height: 64,
          width: 64,
          "& svg": {
            height: 20,
            width: 20,
          },
        }}
      />
      <IconButton
        onClick={handleClick("sentMessages")}
        variant="invisible"
        icon={ListUnorderedIcon}
        sx={{
          height: 64,
          width: 64,
          "& svg": {
            height: 20,
            width: 20,
          },
        }}
      />
    </Box>
  );
}

export default Nav;
