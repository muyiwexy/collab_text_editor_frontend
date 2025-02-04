## Secure RBAC-Based Real-Time Collaborative Text Editor with Nest.js and Gatsby Using Permit.io

A tutorial to showcase REBAC and role derivation through a realtime collaborative text editor built in Gatsby, Nest.js and Gatsby Using Permit.io

[View Tutorial]()

## Getting Started

#### Clone The Repository

```sh
$ https://github.com/muyiwexy/collab_text_editor_frontend.git
```

#### Change directory

```sh
$ cd collab_text_editor_frontend
```

#### Install dependencies

```sh
$ npm install
```

#### Setup Env variables

- Create a `.env.development` file in your root directory and add the following to it:

```
PUBLIC_LIVE_BLOCKS_SECRET_KEY:'LiveBlocks secret key'
PUBLIC_APPWRITE_ENDPOINT:'Appwrite endpoint'
PUBLIC_APPWRITE_PROJECT_ID:'Appwrite project id'
APPWRITE_DATABASE_ID:'Appwrite database id'
APPWRITE_DOCUMENT_COLLECTION_ID:'Appwrite document collection id'
APPWRITE_FOLDER_COLLECTION_ID:'Appwrite folder collection id'
```

#### Start the app

- Open the app in terminals and run `gatsby develop`.
- Open http://localhost:8000/ in your browser to see the app

## Prerequisites

A basic knowledge of React

## Built With

- [LIVEBLOCKS](https://liveblocks.io/) - provides customizable pre-built features that boost user engagement by adding collaboration to your product
- [Gatsby](https://www.gatsbyjs.org/) - A static site generator for React
- [Appwrite](https://appwrite.io/) -open spurce Backend as a service
