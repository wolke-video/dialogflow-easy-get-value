const dialogflow = require("dialogflow");
const uuid = require("uuid");

const intentDetect = async (text) => {
  console.log(text);
  const sessionClient = new dialogflow.SessionsClient({
    credentials: {
      client_email: process.env.client_email,
      private_key: process.env.private_key.replace(/\\n/g, `\n`)
    }
  });
  const sessionPath = sessionClient.sessionPath(
    process.env.project_id,
    uuid.v4()
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: text, // 改成喂
        // The language used by the client (en-US)
        languageCode: "zh-TW" // 改成 zh-TW
      }
    }
  };
  const responses = await sessionClient.detectIntent(request);
  console.log(responses);
  console.log(responses[0].queryResult.intent.displayName);
  console.log(responses[0].queryResult.parameters.fields);
  let intent;
  try {
    intent = responses[0].queryResult.intent.displayName;
  } catch (err) {
    return { error: `no intent` };
  }
  let { fields } = responses[0].queryResult.parameters;
  let entites = {};

  if (Object.keys(fields).length === 0) {
    return { intent };
  } else {
    Object.keys(fields).map((i) => {
      if (fields[i].kind === `stringValue`) {
        entites[i] = fields[i].stringValue;
      }
      if (fields[i].kind === `numberValue`) {
        entites[i] = fields[i].numberValue;
      }
    });
  }

  return { intent, entites };
};
module.exports = intentDetect;
/* */
// (async () => {
//   await intentDetect(`3點10分的天氣`).then((r) => console.log(r));
//   // console.log(d);
// })();
