# Harvest Expense Pal

A small web app for submitting expenses to [Harvest](https://www.getharvest.com/) time tracking,
built to take the tedium out of attaching receipts.

## Why this exists

My employer at the time had a strict rule for expense receipts in Harvest: every receipt had to be
a **PDF** with a **specific file name** built from details of the expense. Taking a photo of a
receipt, converting it to PDF, and renaming it by hand for every expense was a pain.

Harvest Expense Pal does that for you. You fill out the expense form, attach a photo of the
receipt, and the app:

1. Converts the image into a single-page PDF sized to the photo.
2. Names the PDF using the required formula.
3. Creates the expense in Harvest with the PDF attached as the receipt.

### Receipt file name format

```
{ExpenseDate}_{Category}_{Vendor}_{Purpose}_{Total}_{Initials}.pdf
```

| Part          | Source                                             |
| ------------- | -------------------------------------------------- |
| `ExpenseDate` | The **Expense Date** field, formatted as `YYYYMMDD` |
| `Category`    | Name of the selected Harvest expense category      |
| `Vendor`      | The **Vendor** field                               |
| `Purpose`     | The **Purpose** field                              |
| `Total`       | The **Total** field                                |
| `Initials`    | The **Initials** field                             |

For example: `20221201_Meals_Joes Diner_Client lunch_42.50_CD.pdf`

## Receipts are never written to disk

The app was hosted on [Vercel](https://vercel.com), and I didn't want a serverless function writing
files to a filesystem. So the receipt is handled **entirely in memory** from upload to Harvest:

- The upload is parsed with `formidable`, but `form.onPart` is overridden so the image's chunks are
  collected into an in-memory array instead of being saved to a temp file.
- Those chunks are combined into a `Buffer`, which `image-size` reads to get the dimensions.
- `pdfkit` draws the image into a PDF and pipes it to `blob-stream`, which produces an in-memory
  `Blob`.
- That `Blob` is added to a `FormData` request with the generated file name and sent straight to the
  Harvest API.

At no point is the image or the PDF stored in a file. See
[`src/pages/api/harvest/create-expense.ts`](src/pages/api/harvest/create-expense.ts).

## Custom NextAuth Harvest provider

NextAuth.js doesn't ship a Harvest provider, so I wrote my own in
[`src/providers/harvest.ts`](src/providers/harvest.ts). It:

- Points NextAuth at Harvest's OAuth2 authorize, token, and accounts endpoints on
  `id.getharvest.com`.
- Replaces the default token request with its own: a form-encoded `POST` with a `User-Agent`
  header (which Harvest requires) and the client credentials in the body.
- Builds the user profile from Harvest's accounts endpoint, so the list of Harvest accounts the user
  can access comes back alongside the user.

In [`src/pages/api/auth/[...nextauth].ts`](src/pages/api/auth/[...nextauth].ts), the `jwt` callback
saves the Harvest access token and account list in the session token. The tRPC routes and the
expense API read them from there to call Harvest on the user's behalf.

## Features

- **Sign in with Harvest** using OAuth through the custom provider above. The whole app requires
  sign-in.
- **Project picker** that loads your Harvest projects, groups them by client, and lets you search.
- **Expense category picker** that loads your active Harvest expense categories.
- **Two dates**: the _Harvest Date_ is the expense's spent date in Harvest, and the _Expense Date_
  is the date used in the receipt file name.
- **Mobile-friendly receipt capture**: the file input opens the device's rear camera on phones.
- Expenses are created as **billable**, with your notes attached.

## Tech stack

- [Next.js 13](https://nextjs.org) (pages router), React 18, TypeScript
- [NextAuth.js](https://next-auth.js.org) with a custom Harvest OAuth provider
- [tRPC](https://trpc.io) + React Query for loading projects and expense categories
- [Tailwind CSS](https://tailwindcss.com) and [Headless UI](https://headlessui.com)
- [`pdfkit`](https://pdfkit.org), `blob-stream`, `image-size`, and `formidable` for receipt
  processing
- [`harvest`](https://www.npmjs.com/package/harvest) API client

Bootstrapped with [create-t3-app](https://create.t3.gg).

## Getting started

### 1. Create a Harvest OAuth app

In the [Harvest Developer Tools](https://id.getharvest.com/developers), create an OAuth2
application. Set the redirect URL to:

```
<NEXTAUTH_URL>/api/auth/callback/harvest
```

For local development that's `http://localhost:3000/api/auth/callback/harvest`.

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill it in:

| Variable                | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `NEXTAUTH_SECRET`       | Secret for NextAuth (required in production). `openssl rand -base64 32` |
| `NEXTAUTH_URL`          | Base URL of the app, e.g. `http://localhost:3000`                |
| `HARVEST_CLIENT_ID`     | Client ID from your Harvest OAuth app                            |
| `HARVEST_CLIENT_SECRET` | Client secret from your Harvest OAuth app                        |

### 3. Install and run

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Harvest.

## Deploying to Vercel

Import the repository into Vercel and set `NEXTAUTH_SECRET`, `HARVEST_CLIENT_ID`, and
`HARVEST_CLIENT_SECRET` in the project's environment variables. `NEXTAUTH_URL` can be omitted
because NextAuth falls back to Vercel's `VERCEL_URL`. Remember to add your deployment's callback
URL to the Harvest OAuth app.

## Limitations

- Receipts must be **JPG** images, and only one receipt per expense is supported.
- If your Harvest login has access to several accounts, the app uses the **first** one.
