const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    const server = express();

    // Middleware
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // Test API
    server.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // IMPORTANT FIX HERE 👇
    server.all(/.*/, (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
      console.log(`🚀 Server ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error during app preparation:', err);
    process.exit(1);
  });