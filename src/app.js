const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeId (req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({error: "Repository id invalid"})
  }

  return next();
}

app.use('/repositories/:id', validadeId);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return res.json(repository)
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const rIndex = repositories.findIndex(r => r.id === id);

  if (rIndex < 0) {
    return res.status(400).json({error: "repository not found"});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[rIndex].likes
  }

  repositories[rIndex] = repository;

  return res.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const rIndex = repositories.findIndex(r => r.id === id);

  if (rIndex < 0) {
    return res.status(400).json({error: "repository not found"});
  }

  repositories.splice(rIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const rIndex = repositories.findIndex(r => r.id === id);

  if (rIndex < 0) {
    return res.status(400).json({error: "repository not found"});
  }

  const repository = {
    ...repositories[rIndex],
    likes: repositories[rIndex].likes + 1
  }

  repositories[rIndex] = repository;
  
  return res.json(repository);
});

module.exports = app;
