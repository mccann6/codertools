# CoderTools — Free Developer Tools Web App

A comprehensive collection of 16+ free developer tools built with Next.js and Tailwind CSS.

## 🚀 Features

- **16+ Developer Tools**: JSON formatter, Base64 encoder, JWT decoder, UUID generator, and many more
- **SEO Optimized**: Each tool has its own route with proper meta tags
- **Mobile Friendly**: Responsive design built with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes
- **Ad Supported**: Minimal, non-intrusive advertising
- **Fast & Lightweight**: Client-side processing, no backend required

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Azure Container Apps

## 🏗️ Development

The project is located in the `/src` directory to work with the devcontainer setup.

```bash
cd src
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── tools/              # Individual tool pages
├── components/             # Reusable components
│   ├── layout/            # Layout components
│   └── tools/             # Tool-specific components
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## 🧪 Available Tools

### Formatters & Validators

- JSON Formatter
- XML Formatter
- CSS Formatter
- SQL Formatter

### Encoders & Decoders

- Base64 Encoder/Decoder
- URL Encoder/Decoder
- HTML Encoder/Decoder
- JWT Decoder

### Generators

- UUID Generator
- Password Generator
- QR Code Generator
- Lorem Ipsum Generator

### Converters

- Unix Timestamp Converter
- CSV to JSON Converter
- JSON to CSV Converter
- Color Converter

And many more...

## 🚀 Deployment

The application is designed to be deployed on Azure Container Apps with:

- Automatic scaling
- SSL certificates
- Custom domains

## 📄 License

MIT License - see LICENSE file for details.
