import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import 'dotenv/config';

import authRoutes from './routes/auth';
import universitiesRoutes from './routes/universities';
import specialtiesRoutes from './routes/specialties';
import facultiesRoutes from './routes/faculties';
import admissionRoutes from './routes/admission';
import vacanciesRoutes from './routes/vacancies';
import salariesRoutes from './routes/salaries';
import professionsRoutes from './routes/professions';
import careersRoutes from './routes/careers';
import parsingRoutes from './routes/parsing';
import chatRoutes from './routes/chat';
import parseRoutes from './routes/parse';
import profileRoutes from './routes/profile';
import skillsRoutes from './routes/skills';
import languagesRoutes from './routes/languages';
import projectsRoutes from './routes/projects';
import certificatesRoutes from './routes/certificates';
import resumeRoutes from './routes/resume';
import surveysRoutes from './routes/surveys';
import internshipsRoutes from './routes/internships';
import eventsRoutes from './routes/events';
import blogsRoutes from './routes/blogs';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api/auth', authRoutes);
app.route('/api/universities', universitiesRoutes);
app.route('/api/specialties', specialtiesRoutes);
app.route('/api/faculties', facultiesRoutes);
app.route('/api/admission-stats', admissionRoutes);
app.route('/api/vacancies', vacanciesRoutes);
app.route('/api/salaries', salariesRoutes);
app.route('/api/professions', professionsRoutes);
app.route('/api/career-paths', careersRoutes);
app.route('/api/parsing-sessions', parsingRoutes);
app.route('/api/chat', chatRoutes);
app.route('/api/parse', parseRoutes);
app.route('/api/profile', profileRoutes);
app.route('/api/skills', skillsRoutes);
app.route('/api/languages', languagesRoutes);
app.route('/api/projects', projectsRoutes);
app.route('/api/certificates', certificatesRoutes);
app.route('/api/resume', resumeRoutes);
app.route('/api/surveys', surveysRoutes);
app.route('/api/internships', internshipsRoutes);
app.route('/api/events', eventsRoutes);
app.route('/api/blogs', blogsRoutes);

const port = parseInt(process.env.PORT || '3001');

console.log(`[GradPath API] Starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`[GradPath API] Server running at http://localhost:${port}`);
