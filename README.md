# M1p10IhagatianaTsikyBack

This Readme file provides the necessary instructions to launch the application Back Office on your premises.

## Prerequisites

Before you can run the application, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org) : The recommended version is the latest stable version , for this project we used node v20.11.0

## Installation

1. Clone this repository on your machine using the following command:

```
git clone https://github.com/Ihagatiana/m1p10-Ihagatiana-Tsiky-back.git
```

2. Navigate to the application directory:

```
cd m1p10-Ihagatiana-Tsiky-back.git
```

3. Install the project dependencies by running the following command:

```
npm install
```


## Configuration


Do not touch .env create .env.local instead

The database server URL:

```
mongodb+srv://mb:toto@cluster0.5e6cs7n.mongodb.net/assignments?retryWrites=true&w=majority
```

## Running

To launch the application, run the following command:
```
node server.js
```

To launch in dev mode, use : 
```
npm run dev
```

The application will then be executed and will be accessible at the address `http://localhost:3000` in your browser.


