import type { Metadata } from 'next';
import JWTDecoderTool from '@/components/tools/JWTDecoderTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'JWT Decoder - DevToolChest',
  description: 'Decode and inspect JWT (JSON Web Token) headers and payloads. Free online JWT decoder that works client-side for security.',
  keywords: 'JWT decoder, JSON Web Token decoder, JWT parser, decode JWT, JWT inspector',
  openGraph: {
    title: 'JWT Decoder - DevToolChest',
    description: 'Decode and inspect JWT (JSON Web Token) headers and payloads',
    type: 'website',
  },
};

export default function JWTDecoderPage() {
  return (
    <MainLayout>
      <JWTDecoderTool />
    </MainLayout>
  );
}
