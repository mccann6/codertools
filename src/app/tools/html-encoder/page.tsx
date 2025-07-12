import { Metadata } from 'next';
import HTMLEncoderTool from '@/components/tools/HTMLEncoderTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'HTML Encoder/Decoder | DevToolChest',
  description: 'Free online HTML encoder and decoder tool. Encode and decode HTML entities, escape special characters for web development.',
  keywords: ['html encoder', 'html decoder', 'html entities', 'escape html', 'web development tools'],
};

export default function HTMLEncoderPage() {
  return (
    <MainLayout>
      <HTMLEncoderTool />
    </MainLayout>
  );
}
