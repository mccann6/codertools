import { Metadata } from 'next';
import QRGeneratorTool from '@/components/tools/QRGeneratorTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'QR Code Generator | DevToolChest',
  description: 'Generate QR codes for text, URLs, emails, phone numbers, and more. Customize size and download as PNG or SVG.',
  keywords: ['qr code generator', 'qr code', 'barcode generator', 'qr scanner', 'url to qr'],
};

export default function QRGeneratorPage() {
  return (
    <MainLayout>
      <QRGeneratorTool />
    </MainLayout>
  );
}
