const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const { registerGitAPI } = require('./git-api');
const port = parseInt(process.env.PORT, 10) || 3010;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const content = require('./content');
const contentType = require('./content-type');

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json()); // support json encoded bodies
  server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  registerGitAPI(server);
  server.get('/_api/content', (req, res) => {
    return content
      .listTypes(files => {
        res.status(200);
        res.send(JSON.stringify(files));
      })
      .catch(error => {
        res.status(500);
        res.send(JSON.stringify({ error: error.toString(), message: error.stack }));
      });
  });
  server.get('/_api/content-type/:type', (req, res) => {
    return contentType.loadSchema(req.params.type, files => {
      res.send(JSON.stringify(files));
    });
  });
  server.get('/_api/content-types', (req, res) => {
    return contentType.getList((error, files) => {
      if (error) {
        res.status(500);
        res.send(JSON.stringify({ error: error.toString(), message: error.stack }));
        return;
      }
      res.status(200);
      res.send(JSON.stringify(files));
    });
  });
  server.get('/_api/content-types/:type', (req, res) => {
    return contentType.loadSchema(req.params.type, files => {
      res.send(JSON.stringify(files));
    });
  });
  server.get('/_api/content/:type', (req, res) => {
    return content.list(req.params.type, files => {
      res.send(JSON.stringify(files));
    });
  });

  server.get('/_api/content/:type/:slug', (req, res) => {
    console.log(req.params);
    return content
      .load(req.params.type, req.params.slug, data => {
        res.send(JSON.stringify(data));
      })
      .catch(error => {
        res.status(500);
        res.send(JSON.stringify({ error: error.toString(), message: error.stack }));
      });
  });

  server.delete('/_api/content/:type/:slug', (req, res) => {
    return content.deleteContent(req.params.type, req.params.slug, data => {
      res.send();
    });
  });

  server.post('/_api/content/:type/:slug', (req, res) => {
    return content.save(
      req.params.type,
      req.params.slug,
      JSON.stringify(req.body, null, 2),
      data => {
        res.send(JSON.stringify(data));
      },
    );
  });

  server.post('/_api/content/:type', (req, res) => {
    return content.create(req.params.type, JSON.stringify(req.body, null, 2), data => {
      res.send(JSON.stringify(data));
    });
  });

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
