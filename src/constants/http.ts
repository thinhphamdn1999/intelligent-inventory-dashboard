export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const HTTP_ERROR_MESSAGE = {
  NETWORK_REQUEST_FAILED: 'Network request failed',
  REQUEST_RETURNED_AN_ERROR_STATUS: (status: number) =>
    `Request returned an error status: ${status}`,
};
