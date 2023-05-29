import { sendResponse } from './utils/cors';
import { getRequestBody } from './utils/getRequestBody';
import { isRequestsFromSlack } from './utils/isRequestsFromSlack';
import { Router } from 'itty-router';
import { getCondensedSummary } from './slack-web-api';

// Create a new router
const router = Router();

router.post("/lsgptConSumary", async (request, e) => {
	const { headers, requestBody } = await getRequestBody(request);
	const _isRequestsFromSlack = isRequestsFromSlack(headers, requestBody);
	if (!_isRequestsFromSlack) {
		return new Response("400, ignore this request", { status: 400 });
	}
	e.waitUntil(getCondensedSummary(requestBody));
	return sendResponse(request, "In a moment you will see the condensed summary.");
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
*/
router.all("*", () => {
	return new Response("404, not found!", { status: 404 });
});

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request, e));
});
