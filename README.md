# Thoughtful AI Chat Agent

[www.thoughtfulAI-Joses-Chat-project.com](https://thoughtfulai-lac.vercel.app/)
![Thoughtful AI Logo - White Text](https://cdn.prod.website-files.com/61d48f7223249177544ef574/664227ada4b7b61c9a64773f_color_T_white_text.svg)






A minimal, fully functional local web chat app built with React, TypeScript, Vite, and TailwindCSS. This app provides a conversational interface that first checks a hardcoded list of responses about Thoughtful AI, then falls back to an LLM response when needed.

You can easily connect it to either a local LLM endpoint (e.g., llama.cpp) or OpenAI's API.

## Features

- Simple and responsive chat UI
- FAQ-based matching with fallback to LLM
- Built with modern tools: React, TypeScript, Vite, TailwindCSS
- Easily pluggable with local or cloud-based LLM APIs

## Getting Started

To run this project locally:

### Prerequisites

- Node.js (v16 or higher recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JoseRaul42/thoughtful-chat-buddy.git
   ```
   ```
   cd thoughtful-chat-agent
2. Install dependencies
   ```bash 
   npm install 
3. Run project.
   ```bash
   npm run dev


## Configuration

This app supports two types of LLM backends: OpenAI and a local LLM (e.g., Ollama).

### Using OpenAI

Add your openAI api key in the settings.
```bash
sk-your-api-key
```
 The app will then use OpenAI's API for LLM responses.

### Using a Local LLM

Add your Local LLM server url in the settings.
```bash
http://localhost:1234/v1/chat/completions
```
Make sure your local LLM server is running and accessible at the specified URL.

### Notes

- If both values are provided, the app will default to the local LLM.
