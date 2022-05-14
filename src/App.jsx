import { useState } from "react";

import Container from "./components/Container";
import Nav from "./components/Nav";
import ConfigPage from "./pages/Config";
import SendMessagePage from "./pages/SendMessage";
import SentMessagesPage from "./pages/SentMessages";
import TemplatesPage from "./pages/Templates";

const pages = {
  sendMessage: SendMessagePage,
  sentMessages: SentMessagesPage,
  templates: TemplatesPage,
  config: ConfigPage,
};

const App = () => {
  const [page, setPage] = useState("sendMessage");
  const SelectPage = pages[page];

  const handleChangePage = (page) => {
    setPage(page);
  };

  return (
    <Container>
      <Nav onChange={handleChangePage} />
      <SelectPage />
    </Container>
  );
};

export default App;
