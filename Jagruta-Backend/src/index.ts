import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/_app';
import {
  generateProblemMapping,
  generateVotingGuide,
  generatePoliticianSummary
} from './services/aiservice';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter
  })
);

app.post('/api/ai/politician-summary', async (req, res) => {
  try {
    const politicianId =
      req.body?.prompt ||
      req.body?.politicianId ||
      req.body?.messages?.[req.body.messages.length - 1]?.content ||
      '';

    const result = await generatePoliticianSummary(politicianId);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate politician summary.');
  }
});

app.post('/api/ai/problem-mapper', async (req, res) => {
  try {
    const messages = req.body?.messages || [];

    const problem =
      req.body?.problem ||
      messages[messages.length - 1]?.content ||
      req.body?.prompt ||
      '';

    const pincode =
      req.body?.pincode ||
      req.body?.areaPincode ||
      '';

    const result = await generateProblemMapping(problem, pincode);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to map problem.');
  }
});

app.post('/api/ai/voting-guide', async (req, res) => {
  try {
    const prompt = req.body?.prompt || JSON.stringify(req.body || {});
    const result = await generateVotingGuide(prompt);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate voting guide.');
  }
});

app.get('/', (_req, res) => {
  res.send('Jagruta backend running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});