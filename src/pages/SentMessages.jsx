import { useState, useEffect } from "react";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../services/firebase";
import Message from "../models/Message";

import { Box, Heading, IconButton } from "@primer/react";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../components/Table";

import { FileSymlinkFileIcon, DownloadIcon } from "@primer/octicons-react";

const SentMessagesPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const data = snapshot.docs.map((doc) => new Message(doc.data()));
      setData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(data);

  return (
    <Box display="flex" flexDirection="column" height="100%" flexGrow={1}>
      <Heading
        sx={{
          display: "flex",
          height: "15%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 6,
        }}
      >
        Mensajes Enviados
      </Heading>
      <Box
        height="85%"
        sx={{
          boxSizing: "border-box",
          pl: 2,
          pr: 2,
          pb: 2,
          overflowY: "scroll",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>DNI</TableHeaderCell>
              <TableHeaderCell>Nombre Completo</TableHeaderCell>
              <TableHeaderCell>Plantilla</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.dni}</TableCell>
                <TableCell>{item.fullname}</TableCell>
                <TableCell>{item?.template?.name}</TableCell>
                <TableCell>{item?.createdAt}</TableCell>
                <TableCell>
                  <IconButton
                    variant="invisible"
                    icon={FileSymlinkFileIcon}
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
                    variant="invisible"
                    icon={DownloadIcon}
                    sx={{
                      height: 64,
                      width: 64,
                      "& svg": {
                        height: 20,
                        width: 20,
                      },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default SentMessagesPage;
