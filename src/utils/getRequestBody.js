/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
// async function readRequestBody(request) {
//   const { headers } = request;
//   const contentType = headers.get('content-type') || '';

//   if (contentType.includes('application/json')) {
//     return JSON.stringify(await request.json());
//   } else if (contentType.includes('application/text')) {
//     return request.text();
//   } else if (contentType.includes('text/html')) {
//     return request.text();
//   } else if (contentType.includes('form')) {
//     const formData = await request.formData();
//     const body = {};
//     for (const entry of formData.entries()) {
//       body[entry[0]] = entry[1];
//     }
//     return JSON.stringify(body);
//   } else {
//     // Perhaps some other type of data was submitted in the form
//     // like an image, or some other binary data.
//     return 'a file';
//   }
// }
export const getRequestBody = async (request) => {
  // const request = e.request;
  const { headers } = request;

  const contentType = headers.get('content-type') || '';
  let requestBody;

  if (contentType.includes('application/json')) {
    // _request = JSON.stringify(await request.json());
    // _request = JSON.parse(await request.json());
    requestBody = await request.json();
  } else if (contentType.includes('application/text')) {
    requestBody = await request.text();
  } else if (contentType.includes('text/html')) {
    requestBody = await request.text();
  } else if (contentType.includes('text/plain')) {
    requestBody = await request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    // _request = JSON.stringify(body);
    requestBody = body;
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    requestBody = 'a file';
  }
  return { headers, contentType, requestBody };
  // return { request };
  // return "Hola";
}