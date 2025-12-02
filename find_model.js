const https = require('https');
const apiKey = "AIzaSyBx4a1f9T5avytMW9x1aFR0Rzsrcndhcxc";

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1beta/models?key=' + apiKey,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      if (json.models) {
        console.log("MODELS_START");
        json.models.forEach(m => {
          if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
            console.log(m.name);
          }
        });
        console.log("MODELS_END");
      } else {
        console.log("ERROR: " + JSON.stringify(json));
      }
    } catch (e) { console.log("PARSE_ERROR"); }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
