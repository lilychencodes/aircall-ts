type ApiProps = {
  url: string;
  token?: string;
  method: string;
  body?: { [key: string]: any };
  headers?: { [key: string]: string };
}

type ApiParams = {
  method: string;
  headers?: { [key: string]: string };
  body?: string;
}

async function callApi({ url, token, method, body, headers }: ApiProps) {
  const params = { method } as ApiParams;

  if (token) {
    params.headers = { Authorization: `Bearer ${token}` };
  }
  if (headers) {
    params.headers = {
      ...params.headers,
      ...headers,
    };
  }
  if (body) {
    params.body = JSON.stringify(body);
  }

  const response = await fetch(url, params);

  const data = await response.json();

  return data;
}

export default callApi;
