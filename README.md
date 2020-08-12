## INTRO

This is a React php/mysql data driven web application project bootstrapped with .next js and redux
The project codebase lies [here](https://www.github/kipyegonline/commsApp)
The application can be accessed here at [hub](http://www.prhub.com/commsApp)

It is a communication management app for managing correspondences within organisation to ensure the workflow and communication process is effective and everyone is accountable to the assigned tasks/issues.

### Problem statement

Most a times, most organisation have no way of tracking correspondences to and fro company thus making it finicky to track any given document or customer query from the client to the person handling it within the organisation. Most organisations have a black counter book for managing this correspondences within their organisation. However,without a digital way of doing the same and checking feedback,things fall apart.

### The App

This is an internal communication web app that centers around **people** working in **departments** within an organisation handling **issues** from their clients/customers. Once the issues are added bto the sytem they can be tracked by anyone with access to the app.

### The languages

I used React js, UI library, to create UI components, redux to manage state in the front end. Next js provides the server side rendering,routing and the required boiler plates for webpack. The backedn operations include PHP for my SQL operations and MYSQL for data storage... I used express js for authentication.

### app usage

The issues can be added by anyone with access to the app but mostly people working in customer care and company dispatch sections.The issie is assigned to the officer in the org responsible in handling. He.she will be notified upon whic they can respond to the issue. Every issue takes 3 stages; pending,in-progress and resolved step.

#### code usage

The code is written in JSX and can be adopted for any use.

#### Getting Started

> Download or clone this project,

First, install project dependencies and dev dependencies.

```bash
npm install

```

then, run the development server:

```bash
npm run dev
# or
yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### The build

> run npm build, it will build the project files and export the project for deployment...

### Deployment

The project can be deployed to any platform, Vercel, netlify or any cloud host provider... I prefer dropping my build to apache server since my backend requires LAMP.

### License

MIT, 2020
