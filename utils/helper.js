export const success = (data, message) => ({
  data,
  code: 1,
  message: message || 'ok'
});

export const fail = (data, message) => ({
  data,
  code: 0,
  message: message || 'fail'
});
