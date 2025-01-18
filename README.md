# GitHub Repo Explorer

GitHub Repo Explorer is a web application that allows users to explore GitHub repositories directly from their browser. It supports authentication for private repositories, displays repository details, and enables copying folder-file structures for documentation purposes.

## Features

- **Sign In with GitHub**: Access private repositories using GitHub authentication.
- **Repository Details**: View information such as stars, watchers, branches, primary language, creation and update dates, and visibility (public/private).
- **Copy File Structure**: Easily copy the folder-file structure of a repository for documentation or reference.
- **Theme Toggle**: Switch between light and dark themes.

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with GitHub OAuth

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- GitHub account with developer access
- GitHub OAuth application set up

### Clone the Repository

```bash
git clone https://github.com/subh05sus/gh-explore.git
cd gh-explore
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-paste-it-here
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

#### How to Generate the `NEXTAUTH_SECRET`

You can generate a secure secret key using one of the following commands:

- Using OpenSSL:

  ```bash
  openssl rand -base64 32
  ```

- Using Node.js:

  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### How to Get the GitHub Client ID and Secret

1. Go to GitHub and sign in to your account.
2. Click on your profile picture in the top-right corner and select "Settings" from the dropdown menu.
3. Scroll down the left sidebar and click on "Developer settings" near the bottom.
4. In the left sidebar of the Developer settings, click on "OAuth Apps".
5. Click the "New OAuth App" button.
6. Fill out the form with the following information:
   - **Application name**: Choose a name for your app (e.g., "GitHub Repo Explorer")
   - **Homepage URL**: Enter your application's homepage URL (e.g., [http://localhost:3000](http://localhost:3000) for local development)
   - **Application description**: (Optional) Provide a brief description of your app
   - **Authorization callback URL**: This should be your app's callback URL (e.g., [http://localhost:3000/api/auth/callback/github](http://localhost:3000/api/auth/callback/github) for local development)
7. Click "Register application".
8. On the next page, you'll see your new OAuth App's details. The "Client ID" field contains your GITHUB_ID.
9. Click "Generate a new client secret" to create your GITHUB_SECRET.

### Start the Application

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Navigate to the application in your browser.
2. Sign in with your GitHub account to explore your private repositories else you can only explore any public repository.
3. Select a repository to view details and copy its file structure.
4. Toggle between light and dark themes for a better user experience.


## License

This project does not currently specify a license.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Contact

Created by **Subhadip Saha**.

If you have any questions or feedback, feel free to reach out!
