import { NextResponse } from 'next/server';

const OWNER = 'trevore777';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  if (!repo || !/^[A-Za-z0-9._-]+$/.test(repo)) {
    return NextResponse.json({ error: 'Invalid repository name.' }, { status: 400 });
  }

  const headers = {
    Accept: 'application/vnd.github.raw+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${OWNER}/${repo}/readme`, {
    headers,
    cache: 'no-store'
  });

  if (response.status === 404) {
    return NextResponse.json({ error: 'No README was found, or this private repository requires GITHUB_TOKEN.' }, { status: 404 });
  }
  if (!response.ok) {
    return NextResponse.json({ error: `GitHub returned ${response.status}.` }, { status: response.status });
  }

  const content = await response.text();
  return NextResponse.json({ content });
}
