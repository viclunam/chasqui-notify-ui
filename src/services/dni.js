const URL_BASE = "https://search-dni.herokuapp.com/api/v1";

const fetchDNI = (dni) =>
  fetch(`${URL_BASE}/dni/${dni}`).then((response) => response.json());

export default fetchDNI;
