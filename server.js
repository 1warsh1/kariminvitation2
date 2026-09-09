const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'wishes.json');

// Initial default wishes if database file doesn't exist
const DEFAULT_WISHES = [
  {
    id: 1,
    name: "Honored Guest",
    status: "Attending",
    wishes: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Heartfelt congratulations to Karim Gharba!",
    time: new Date().toISOString()
  }
];

// Ensure database file exists
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_WISHES, null, 2), 'utf8');
  }
}

function getWishes() {
  try {
    initDb();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading DB:", err);
    return DEFAULT_WISHES;
  }
}

function saveWish(newWish) {
  try {
    const wishes = getWishes();
    const wishRecord = {
      id: Date.now(),
      name: newWish.name ? newWish.name.trim() : 'Honored Guest',
      status: newWish.status === 'Unable' ? 'Unable' : 'Attending',
      wishes: newWish.wishes ? newWish.wishes.trim() : '',
      time: new Date().toISOString()
    };
    wishes.unshift(wishRecord);
    fs.writeFileSync(DB_FILE, JSON.stringify(wishes, null, 2), 'utf8');
    return wishes;
  } catch (err) {
    console.error("Error saving to DB:", err);
    throw err;
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API Endpoints for persistent database
  if (pathname === '/api/wishes') {
    if (req.method === 'GET') {
      const wishes = getWishes();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(wishes));
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const updatedWishes = saveWish(parsed);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, wishes: updatedWishes }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid payload' }));
        }
      });
      return;
    }
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

initDb();
server.listen(PORT, () => {
  console.log(`Server with persistent wishes database active on http://localhost:${PORT}`);
});
