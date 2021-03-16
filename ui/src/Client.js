/* eslint-disable no-undef */
function getSize(cb) {
  return fetch('/api/get_size', {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}
/* eslint-disable no-undef */
function getStatus(cb) {
  return fetch('/api/get_status', {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    console.log("Response Status: "+response.statusText)
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { getStatus, getSize };
export default Client;
