export const getCondensedSummary = async (requestBody) => {
  try {
    const { channel_id, response_url } = requestBody;
    const { promptToSummary } = await getConversationsHistory(channel_id);
    
    const openAIResponse = await getOpenAIResponse(promptToSummary);
    
    await sendResponseToSlack(response_url, openAIResponse);
  } catch (error) {
    return error;
  }
};

const getConversationsHistory = async (channel_id) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({ channel: channel_id }),
    };
    let _cursor = "";
    let conversationHistory = [];
    do {
      let response = await fetch(`https://slack.com/api/conversations.history${_cursor ? `?cursor=${_cursor}` : ""}`, options);
      let responseData = await response.json();
      if (!responseData || !responseData.ok) {
        return;
      }
      responseData.messages.forEach((message) => {
        if (message.type === "message" && message.text ) {
          conversationHistory.push({
            user: `<@${message.user}>`,
            text: message.text,
          });
        }
      });
      _cursor = responseData.response_metadata.next_cursor || "";
    } while (_cursor !== "");

    const promptToSummary = conversationHistory.reverse().reduce((acc, message) => {
      acc += `${message.user}: ${message.text}\n`;
      return acc;
    }, `As an AI language model with expertise in natural language processing and summarization, please generate a condensed summary of a given Slack channel. The summary should accurately capture the most important information and main ideas discussed within the channel, while omitting unnecessary details and less important messages. Keep in mind that the summary should be concise and easy to understand for anyone who may not have been following the conversation closely.\n\n`);

    return { promptToSummary };
  } catch (error) {
    return error;
  }
};

const getOpenAIResponse = async (promptToSummary) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "model": "text-davinci-003",
          "prompt": promptToSummary,
          "temperature": 0,
          "max_tokens": 1000,
          "top_p": 1.0,
          "frequency_penalty": 0.0,
          "presence_penalty": 0.0
      }),
    };
    const response = await fetch("https://api.openai.com/v1/completions", options);

    const responseData = await response.json();
    return responseData.choices[0].text;
  } catch (error) {
    return error;
  }
};

const sendResponseToSlack = async (response_url, response) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ text: response }),
    };
    const responseToSlack = await fetch(response_url, options);
    return responseToSlack;
  } catch (error) {
    console.log(error);
  }
};