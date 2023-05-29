import { getRequestBody } from './getRequestBody';

export const isRequestsFromSlack = async (headers, requestBody) => {
	
	const timestamp = headers.get("X-Slack-Request-Timestamp")
	// convert current time from milliseconds to seconds
	const time = Math.floor(new Date().getTime()/1000);
	if (Math.abs(time - timestamp) > 300) { // 60 * 5 = 300 seconds = 5 minutes
		// return res.status(400).send('Ignore this request.');
		return new Response("400, ignore this request", { status: 400 });
	}

  const sigBasestring = 'v0:' + timestamp + ':' + requestBody;
  // const slackSigningSecret = SLACK_SIGNING_SECRET;

  const mySignature = 'v0=' + await crypto.createHmac('sha256', SLACK_SIGNING_SECRET).update(sigBasestring, 'utf8').digest('hex');

  const _isRequestsFromSlack = await crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'), Buffer.from(slackSignature, 'utf8'));

  return _isRequestsFromSlack;
};