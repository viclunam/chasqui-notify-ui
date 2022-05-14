const URL_BASE = "http://localhost:4000/api/v1";

const fetchDNI = (dni) =>
  fetch(`${URL_BASE}/dni/${dni}`).then((response) => response.json());

export default fetchDNI;
