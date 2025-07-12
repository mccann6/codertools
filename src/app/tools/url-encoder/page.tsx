import { Metadata } from 'next';
import URLEncoderTool from '@/components/tools/URLEncoderTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder | CoderTools',
  description: 'Free online URL encoder and decoder tool. Encode and decode URLs, handle special characters, and format URLs properly.',
  keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri encoding', 'web development tools'],
};

export default function URLEncoderPage() {
  return (
    <MainLayout>
      <URLEncoderTool />
    </MainLayout>
  );
}
