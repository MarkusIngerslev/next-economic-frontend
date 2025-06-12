<h1 align="center">
  Final Project frontend - ØkoSmart
</h1>

In this repository, you will find the frontend part of the Economic Dashboard. The frontend is build with Nextjs & TailwindCSS. The frontend is responsible for displaying the data from the backend and also for the user interaction. The frontend is connected to the backend through the API.

The backend part of the Economic Dashboard can be found in the following repository: [Final Project backend - ØkoSmart](https://github.com/MarkusIngerslev/nest-economic-backend)

## Installation

Before you can run the frontend, you need to have the package manager [pnpm](https://www.npmjs.com/) installed on your machine. You can check if you have it installed by running the following command in your terminal:

```bash
pnpm --version
```

If you don't have pnpm installed, you can install it globally using npm:

```bash
npm install -g pnpm
```

## Getting Started

To get started with the Economic Dashboard frontend, follow these steps:

1. Clone the repository:

   ```bash
   git clone url-to-repository
   ```

2. Navigate to the project directory:

   ```bash
   cd economic-dashboard-frontend
   ```

3. Install the dependencies:

   ```bash
    pnpm install
   ```

## Usage

First you need to add a `.env.local` file in the root of the project. The `.env.local` file should contain the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
```

After you have created the `.env.local` file, you can start the development server. The frontend will be running on `http://localhost:3000` by default.

To run the development server, use the following command:

```bash
pnpm run dev
```

## Uninstalling pnpm

If you don't want to keep pnpm installed on your machine, you can uninstall it by running the following command:

```bash
npm uninstall -g pnpm
```

This will remove pnpm from your machine.

_This project was created by [Markus Ingerslev Olsen](https://github.com/MarkusIngerslev)_
