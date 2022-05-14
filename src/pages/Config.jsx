import { useState, useEffect } from "react";
import useGlobalState from "../context/useGlobalState";

import { getPorts } from "./../services/arduino";

import { Box, Heading, FormControl, Select } from "@primer/react";

const ConfigPage = () => {
  const [options, setOptions] = useState([]);
  const [arduino, setArduino] = useState(null);
  const { setData } = useGlobalState();

  useEffect(() => {
    getPorts().then((ports) => {
      const portsFilter = ports
        .filter((item) => !!item.manufacturer)
        .map((item) => ({
          manufacturer: item.manufacturer,
          port: item.path,
          serial: item.serialNumber,
        }));
      setOptions(portsFilter);
    });
  }, []);

  const handleChange = async (e) => {
    const port = e.target.value;
    const selectArduino = options.find((item) => item.port === port);
    setArduino(selectArduino);
    setData({
      arduino: selectArduino,
    })
  };

  return (
    <Box height="100%" flexGrow={1}>
      <Heading
        aria-label="Configuración"
        sx={{
          display: "flex",
          height: "15%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 6,
        }}
      >
        Configuración
      </Heading>
      <Box
        display="grid"
        sx={{
          boxSizing: "border-box",
          placeContent: "center",
        }}
      >
        <FormControl
          aria-label="Puerto USB"
          required
          sx={{
            mb: 3,
          }}
        >
          <FormControl.Label>Puerto USB</FormControl.Label>
          <Select
            name="port"
            value={arduino?.port ?? ""}
            onChange={handleChange}
          >
            <Select.Option value="">Ninguno seleccionado</Select.Option>
            {options.map((option) => (
              <Select.Option
                key={option.serial}
                aria-label={option.manufacturer}
                value={option.port}
              >
                {option.manufacturer}
              </Select.Option>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ConfigPage;
