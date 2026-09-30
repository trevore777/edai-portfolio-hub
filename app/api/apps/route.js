import { promises as fs } from 'fs';
import path from 'path';
import { repos as baseRepos } from '../../data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'app-data');
const DATA_FILE = path.join(DATA_DIR, 'custom-apps.json');

const allowedStatus = new Set(['Production', 'Development', 'Prototype', 'Paused', 'Superseded']);
const allowedHosting = new Set(['AWS', 'Vercel', 'Local', 'Other']);
const allowedDatabase = new Set(['PostgreSQL', 'Neon', 'RDS', 'none']);
const allowedPriority = new Set(['High', 'Normal', 'Low']);
const allowedVisibility = new Set(['private', 'public']);

async function readApps() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeApps(apps) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temp = DATA_FILE + '.tmp';
  await fs.writeFile(temp, JSON.stringify(apps, null, 2) + '\n', 'utf8');
  await fs.rename(temp, DATA_FILE);
}

export async function GET() {
  try {
    return Response.json({ apps: await readApps() });
  } catch {
    return Response.json({ error: 'Unable to load custom apps.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const category = String(body.category || '').trim();

    if (!name || !category) {
      return Response.json({ error: 'Name and category are required.' }, { status: 400 });
    }

    if (!/^[A-Za-z0-9._-]+$/.test(name)) {
      return Response.json({ error: 'App name can only contain letters, numbers, dots, hyphens and underscores.' }, { status: 400 });
    }

    const apps = await readApps();
    const duplicate = [...baseRepos, ...apps].some(app => app.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      return Response.json({ error: 'That repository / app is already in the hub.' }, { status: 409 });
    }

    const app = {
      name,
      category,
      visibility: allowedVisibility.has(body.visibility) ? body.visibility : 'private',
      status: allowedStatus.has(body.status) ? body.status : 'Development',
      hosting: allowedHosting.has(body.hosting) ? body.hosting : 'Other',
      live: String(body.live || '').trim(),
      database: allowedDatabase.has(body.database) ? body.database : 'none',
      lastWorkedOn: String(body.lastWorkedOn || '').trim(),
      notes: String(body.notes || '').trim(),
      priority: allowedPriority.has(body.priority) ? body.priority : 'Normal',
      repoUrl: String(body.repoUrl || '').trim() || `https://github.com/trevore777/${name}`
    };

    const next = [...apps, app];
    await writeApps(next);
    return Response.json({ apps: next, app }, { status: 201 });
  } catch {
    return Response.json({ error: 'Unable to save the new app.' }, { status: 500 });
  }
}
