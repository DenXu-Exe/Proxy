//Test
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Optional: simple auth token (recommended)
  // const auth = event.headers['authorization'];
  // if (auth !== `Bearer ${process.env.AUTH_TOKEN}`) {
  //   return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  // }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  try {
    const discordRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!discordRes.ok) {
      const txt = await discordRes.text();
      throw new Error(`Discord ${discordRes.status}: ${txt}`);
    }

    console.log('Forwarded:', JSON.stringify(payload));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Sent to Discord' }),
    };
  } catch (err) {
    console.error('Proxy error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Forward failed', details: err.message }),
    };
  }
};
