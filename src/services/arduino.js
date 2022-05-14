const URL_BASE = "http://localhost:4000/api/v1";

export const getPorts = () => {
  return fetch(`${URL_BASE}/arduino/ports`).then((response) => response.json());
}