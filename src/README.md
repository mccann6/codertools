# CoderTools

A comprehensive web application featuring 100+ developer tools including JSON formatter, Base64 encoder, JWT decoder, and many more. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **100+ Developer Tools**: JSON formatter, Base64 encoder/decoder, JWT decoder, UUID generator, password generator, QR code generator, and more
- **SEO Optimized**: Each tool has its own route with proper metadata
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Client-Side Processing**: All tools work entirely in the browser for privacy
- **Ad-Supported**: Free to use with ad placements for monetization
- **Organized Categories**: Tools grouped by type with expandable sidebar navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd codertools/src
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── tools/             # Individual tool pages
├── components/            # React components
│   ├── layout/           # Layout components (Header, Sidebar, MainLayout)
│   └── tools/            # Tool-specific components
├── lib/                   # Utility functions
└── public/               # Static assets
```

## Available Tools

### Text & Data Processing

- JSON Formatter & Validator
- Base64 Encoder/Decoder
- CSV to JSON Converter
- JSON to CSV Converter
- XML Formatter
- HTML Encoder/Decoder
- URL Encoder/Decoder
- Lorem Ipsum Generator

### Code & Development

- CSS Formatter & Minifier
- SQL Formatter
- JWT Decoder
- UUID Generator
- Password Generator

### Utilities

- QR Code Generator
- Timestamp Converter
- Color Converter

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library
- **QR Code Libraries** - For QR code generation

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
