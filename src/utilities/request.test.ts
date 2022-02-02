import callApi from './request';

describe('callApi', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((): jest.MockedFunction<any> => {
      return Promise.resolve({ json: () => Promise.resolve({ test: true })})
    });
  });

  const url = 'google.com';

  it('fetches with headers and body', async () => {
    const result = await callApi({
      url,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { test: true }
    });

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('fetches with body', async () => {
    const result = await callApi({ url, method: 'POST', body: { test: true } });

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      body: JSON.stringify({ test: true }),
    });
  });

  it('fetches with token', async () => {
    const result = await callApi({ url, method: 'GET', token: 'test' });

    expect(fetch).toHaveBeenCalledWith(url, {
      method: 'GET',
      headers: { Authorization: `Bearer test` },
    });
  });
});
