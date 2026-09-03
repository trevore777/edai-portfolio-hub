# TrevorE77 Repository Administration Hub

Personal administration website for Trevor Elliott / EDU Apps Plus repositories.

## Features

- Search all catalogued `trevore777` repositories.
- Filter by app category and public/private visibility.
- Direct links to GitHub repositories.
- Direct links to known live applications.
- In-page README viewer.
- Private README support using a server-side GitHub token.
- Optional Basic Authentication for personal access.

## Environment variables

Set these in the hosting environment:

- `GITHUB_TOKEN` — GitHub fine-grained token with read-only Contents access to the repositories you want to view. Required for private README files.
- `ADMIN_USER` — username for the personal administration website.
- `ADMIN_PASSWORD` — password for the personal administration website.

If `ADMIN_USER` or `ADMIN_PASSWORD` is not configured, the site remains accessible without the password prompt so the first deployment can be tested.

## Suggested production address

`https://trevore77.eduappsplus.com.au`

## Updating the catalogue

Repository entries are maintained in `app/data.js`. Add a `live` URL when a production app address is known.

## Local development

```bash
npm install
npm run dev
```
