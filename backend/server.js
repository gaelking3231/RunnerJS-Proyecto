const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); app.use(bodyParser.json());

const DATA = path.join(__dirname, 'data', 'scores.json');
function readScores(){ try{return JSON.parse(fs.readFileSync(DATA))}catch(e){return []} }
function writeScores(arr){ fs.writeFileSync(DATA, JSON.stringify(arr,null,2)) }

const rate = {}; const RATE_WINDOW = 60*1000; const MAX_PER_WINDOW = 10;
function checkRate(ip){ const now = Date.now(); if(!rate[ip]) rate[ip] = []; rate[ip] = rate[ip].filter(t=> t > now - RATE_WINDOW); if(rate[ip].length >= MAX_PER_WINDOW) return false; rate[ip].push(now); return true }

app.get('/scores', (req,res)=>{
  const limit = Math.min(parseInt(req.query.limit)||10,50);
  const scores = readScores().sort((a,b)=> b.score - a.score).slice(0, limit);
  res.json(scores);
});

app.post('/scores', (req,res)=>{
  const ip = req.ip || req.connection.remoteAddress;
  if(!checkRate(ip)) return res.status(429).json({ error:'rate limit' });
  const { name, score, level } = req.body;
  if(!name || typeof name !== 'string' || name.trim().length>30) return res.status(400).json({ error:'name' });
  if(typeof score !== 'number' || score < 0 || score > 1e7) return res.status(400).json({ error:'score' });
  const entry = { name: name.trim().slice(0,30), score: Math.floor(score), level: parseInt(level)||1, date: new Date().toISOString() };
  const arr = readScores(); arr.push(entry); writeScores(arr);
  res.json({ ok:true });
});

const PORT = process.env.PORT || 3000; app.listen(PORT, ()=> console.log('Server on', PORT));
