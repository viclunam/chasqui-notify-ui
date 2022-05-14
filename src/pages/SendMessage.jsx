import { useState, useEffect } from "react";

import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { db, storage } from "../services/firebase";
import fetchDNI from "../services/dni";
import Template from "../models/Template";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  Heading,
  Button,
  FormControl,
  TextInput,
  Select,
  Textarea,
  Spinner,
} from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";

import illustration1 from "./../illustration_1.svg";

const initialState = {
  dni: "",
  fullname: "",
  template: "none",
  phone: "",
  content: "",
};

const SendMessagePage = () => {
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataTemplate, setDataTemplate] = useState({
    fullName: "",
    names: "",
    firstLastName: "",
    secondLastName: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "templates"), (snapshot) => {
      const data = snapshot.docs.map((doc) => new Template(doc.data()));
      setOptions(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (message.dni.length === 8) {
      searchDni(message.dni);
    }
  }, [message.dni]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const searchDni = async () => {
    const result = await fetchDNI(message.dni);
    if (result) {
      setMessage((prevState) => ({
        ...prevState,
        fullname: result.fullName,
      }));
      setDataTemplate({
        fullName: result.fullName,
        names: result.names,
        firstLastName: result.firstLastName,
        secondLastName: result.secondLastName,
      });
    }
  };

  const handleSend = async () => {
    setLoading(true);
    const template = options.find(
      (template) => template.id === message.template
    );
    const today = new Date();
    const date = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;

    const id = uuidv4();
    const refDoc = doc(db, "messages", id);
    const refStorage = ref(storage, `${date}/${message.dni}.pdf`);

    const uploadTask = uploadBytesResumable(refStorage, file);
    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);

    await setDoc(refDoc, {
      ...message,
      id,
      template: {
        ...template,
      },
      content: builderPreviewMessage(message.template),
      urlDocument: downloadURL,
      createdAt: today.toISOString(),
    });
    setMessage(initialState);
    setFile(null);
    setLoading(false);
  };

  const builderPreviewMessage = (templateId) => {
    const template = options.find((template) => template.id === templateId);
    const regexFindFields = /\{\{[^}]+\}\}/g;
    const avaiableFields = {
      "{{NOMBRES}}": dataTemplate.names,
      "{{PRIMER_APELLIDO}}": dataTemplate.firstLastName,
      "{{SEGUNDO_APELLIDO}}": dataTemplate.secondLastName,
      "{{LINK}}": "*Enlace*",
    };

    const fields = template?.message.match(regexFindFields);

    if (fields) {
      const values = fields.map((field) => avaiableFields[field]);
      return template.message.replace(regexFindFields, () => values.shift());
    }

    return template?.message ?? "";
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  if (loading) {
    return (
      <Box
        height="100%"
        display="grid"
        sx={{
          placeContent: "center",
        }}
        flexGrow={1}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box height="100%" flexGrow={1}>
      <Heading
        aria-label="Enviar Resultado"
        sx={{
          display: "flex",
          height: "15%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 6,
        }}
      >
        Enviar Resultado
      </Heading>
      <Box
        display="grid"
        gridTemplateColumns="auto 40%"
        gridGap={4}
        height="85%"
        sx={{
          boxSizing: "border-box",
        }}
      >
        <Box
          display="grid"
          sx={{
            placeContent: "center",
          }}
        >
          <FormControl
            aria-label="Dni"
            required
            sx={{
              mb: 3,
              width: "350px",
            }}
          >
            <FormControl.Label>Dni</FormControl.Label>
            <TextInput
              type="number"
              name="dni"
              value={message.dni}
              onChange={handleChange}
              trailingAction={
                <TextInput.Action
                  aria-label="Search Dni"
                  onClick={searchDni}
                  icon={SearchIcon}
                />
              }
            />
          </FormControl>
          <FormControl
            aria-label="Nombre del Paciente"
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Nombre del Paciente</FormControl.Label>
            <TextInput
              readOnly
              name="fullname"
              value={message.fullname}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl
            aria-label="Plantilla"
            required
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Plantilla</FormControl.Label>
            <Select
              name="template"
              value={message.template}
              onChange={handleChange}
            >
              <Select.Option value={"none"}>Ninguno seleccionado</Select.Option>
              {options.map((option) => (
                <Select.Option
                  key={option.id}
                  aria-label={option.name}
                  value={option.id}
                >
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <FormControl
            aria-label="Celular"
            required
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Celular</FormControl.Label>
            <TextInput
              name="phone"
              value={message.phone}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl
            aria-label="Mensaje"
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Mensaje</FormControl.Label>
            <Textarea
              readOnly
              name="content"
              value={builderPreviewMessage(message.template)}
              onChange={handleChange}
              cols={15}
              resize="none"
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
          <img src={illustration1} alt="Medical" width="100%" />
          <div className="ButtonInputFile">
            <label htmlFor="input-file">Seleccione el archivo</label>
            <input
              required
              onClick={handleUpload}
              id="input-file"
              type="file"
              accept=".pdf"
              hidden
            />
          </div>
          <Button
            aria-label="Enviar"
            onClick={handleSend}
            size="large"
            sx={{
              mt: 4,
              width: "200px",
              borderRadius: 8,
              backgroundColor: "#8EC5FC",
              color: "white",
            }}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SendMessagePage;
