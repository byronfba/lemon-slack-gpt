// A list of allowed origins that can access our backend API
const allowedOrigins = [
	"*",
  // "https://lemon-slack-gpt.epikapp.workers.dev",
	"https://lemon-slack-gpt.epikapp.io",
];

// A function that returns a set of CORS headers
export const corsHeaders = origin => ({
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Allow-Origin': origin
});

// Check the origin for this request
// If it is included in our set of known and allowed origins, return it, otherwise
// return a known, good origin. This effectively does not allow browsers to
// continue requests if the origin they're requesting from doesn't match.
export const checkOrigin = request => {
  const origin = request.headers.get("Origin")
  const foundOrigin = allowedOrigins.find(allowedOrigin => allowedOrigin.includes(origin))
  return foundOrigin ? foundOrigin : allowedOrigins[0]
};

// A function that returns a response with the appropriate CORS headers
export const sendResponse = (request, response, opt = { contentType: "application/json" }) => {
  const { contentType } = opt;
  return new Response(
    // JSON.stringify(response),
    response,
    { headers: { "Content-Type": contentType, ...corsHeaders(checkOrigin(request))}
  });
};