import type { Metadata } from 'next';
import Base64Tool from '@/components/tools/Base64Tool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - DevToolChest',
  description: 'Encode and decode Base64 strings online. Free tool for Base64 encoding and decoding with support for text and file data.',
  keywords: 'Base64 encoder, Base64 decoder, encode base64, decode base64, base64 converter',
  openGraph: {
    title: 'Base64 Encoder & Decoder - DevToolChest',
    description: 'Encode and decode Base64 strings online',
    type: 'website',
  },
};

export default function Base64Page() {
  return (
    <MainLayout>
      <Base64Tool />
    </MainLayout>
  );
}
