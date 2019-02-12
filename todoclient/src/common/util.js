export function getFormData(params) {
  const formData = new FormData();

  Object.keys(params).forEach((key, index) => {
    if (params && params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  });

  return formData;
}

function serialize(obj) {
  const str = [];

  Object.keys(obj).forEach((p) => {
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  });

  return str.join('&');
}

export async function fetchJson({
  uri,
  method,
  body,
  formData,
  headers
}) {
  const options = { method, headers };

  let apiUri = uri;
  if (method.toUpperCase() === 'GET') {
    apiUri = `${uri}?${serialize(formData || {})}`;
  } else {
    options.body = body || (formData && getFormData(formData));
  }

  console.log(apiUri, options);

  try {
    const response = await fetch(apiUri, options);
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    // console.log('content-type', contentType);
    // console.log('response_text', text);

    if (
      contentType &&
      (contentType.indexOf('html') !== -1 ||
        contentType.indexOf('plain') !== -1)
    ) {
      console.log('fetch text', apiUri, text);
      return text;
    }

    const json = JSON.parse(text);
    console.log('fetch', apiUri, json);

    return json;
  } catch (error) {
    error.apiUri = apiUri;
    // console.error('api call error on -> ', apiUri);
    console.log('====================================');
    console.log('error', error);
    console.log('====================================');

    throw error;
  }
}

export default {
  fetch: fetchJson
};
