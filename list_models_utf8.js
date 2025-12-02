const https = require('https');
const fs = require('fs');
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
      let output = "";
      if (json.models) {
        json.models.forEach(m => {
          if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
            output += m.name + "\n";
          }
        });
      } else {
        output = "ERROR: " + JSON.stringify(json);
      }
      fs.writeFileSync('models_utf8.txt', output, 'utf8');
      console.log("Done");
    } catch (e) { console.log("PARSE_ERROR"); }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
