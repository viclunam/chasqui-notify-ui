import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Template from "../models/Template";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Heading,
  Button,
  IconButton,
  FormControl,
  TextInput,
  Textarea,
} from "@primer/react";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../components/Table";

import { PencilIcon, TrashIcon } from "@primer/octicons-react";

const TemplatesPage = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [template, setTemplate] = useState({
    id: "",
    name: "",
    message: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "templates"), (snapshot) => {
      const data = snapshot.docs.map((doc) => new Template(doc.data()));
      setData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSend = async () => {
    if (isEdit) {
      const ref = doc(db, "templates", template.id);
      await updateDoc(ref, {
        name: template.name,
        message: template.message,
      });
      setIsEdit(false);
      setTemplate({ name: "", message: "" });
      return;
    }

    const id = uuidv4();
    const ref = doc(db, "templates", id);
    await setDoc(ref, {
      id,
      name: template.name,
      message: template.message,
    });
    setTemplate({ name: "", message: "" });
  };

  const handleEdit = (item) => () => {
    setTemplate(item);
    setIsEdit(true);
  };

  const handleDelete = (item) => async () => {
    const ref = doc(db, "templates", item.id);
    await deleteDoc(ref);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" flexGrow={1}>
      <Heading
        sx={{
          display: "flex",
          height: "15%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 6,
          p: 2,
        }}
      >
        Plantillas de Mensaje
      </Heading>
      <Box
        display="grid"
        gridTemplateColumns="auto 20%"
        gridGap={4}
        height="30%"
        sx={{
          boxSizing: "border-box",
        }}
      >
        <Box
          display="grid"
          width="100%"
          sx={{
            boxSizing: "border-box",
            placeContent: "center",
            justifyContent: "normal",
            pl: 4,
          }}
        >
          <FormControl
            aria-label="Nombre de la Plantilla"
            required
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Nombre de la plantilla</FormControl.Label>
            <TextInput
              name="name"
              value={template.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl
            aria-label="Mensaje"
            required
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Mensaje</FormControl.Label>
            <Textarea
              name="message"
              value={template.message}
              onChange={handleChange}
              cols={10}
              resize="none"
              sx={{
                height: "60px",
              }}
            />
          </FormControl>
        </Box>
        <Box
          display="grid"
          sx={{
            placeContent: "center",
            placeItems: "center",
          }}
        >
          <Button
            onClick={handleSend}
            disabled={template.name === "" || !template.message === ""}
            size="large"
            sx={{
              mt: 2,
              borderRadius: 8,
              backgroundColor: "#8EC5FC",
              color: "white",
            }}
          >
            Guardar
          </Button>
        </Box>
      </Box>
      <Box flexGrow={1} sx={{ overflowY: "scroll", pl: 2, pr: 2, pb: 2 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell>Mensaje</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.message}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={handleEdit(item)}
                    variant="invisible"
                    icon={PencilIcon}
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
                    onClick={handleDelete(item)}
                    variant="invisible"
                    icon={TrashIcon}
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

export default TemplatesPage;
