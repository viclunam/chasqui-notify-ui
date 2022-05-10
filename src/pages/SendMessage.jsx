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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "templates"), (snapshot) => {
      const data = snapshot.docs.map((doc) => new Template(doc.data()));
      setOptions(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const searchDni = async () => {
    const result = await fetchDNI(message.dni);
  };

  const handleSend = async () => {
    const template = options.find(
      (template) => template.id === message.template
    );
    const id = uuidv4();
    const ref = doc(db, "messages", id);

    await setDoc(ref, {
      ...message,
      template: {
        ...template,
      },
    });
    setMessage(initialState);
  };

  const builderPreviewMessage = (templateId) => {
    const template = options.find((template) => template.id === templateId);
    return template?.message ?? "";
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const today = new Date();
    const date = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;

    const refStorage = ref(storage, `${date}/${message.dni}.pdf`);
    const uploadTask = uploadBytesResumable(refStorage, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };

  return (
    <Box height="100%" flexGrow={1}>
      <Heading
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
            sx={{
              mb: 3,
              width: "350px",
            }}
          >
            <FormControl.Label>Dni</FormControl.Label>
            <TextInput
              name="dni"
              value={message.dni}
              onChange={handleChange}
              required
              type="number"
              trailingAction={
                <TextInput.Action onClick={searchDni} icon={SearchIcon} />
              }
            />
          </FormControl>
          <FormControl
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
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Plantilla</FormControl.Label>
            <Select
              name="template"
              value={message.template}
              onChange={handleChange}
              required
            >
              <Select.Option value={"none"}>Ninguno seleccionado</Select.Option>
              {options.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Celular</FormControl.Label>
            <TextInput
              name="phone"
              value={message.phone}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl
            sx={{
              mb: 3,
            }}
          >
            <FormControl.Label>Mensaje</FormControl.Label>
            <Textarea
              name="content"
              value={builderPreviewMessage(message.template)}
              onChange={handleChange}
              readOnly
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
              onClick={handleUpload}
              id="input-file"
              type="file"
              accept=".pdf"
              hidden
            />
          </div>
          <Button
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
