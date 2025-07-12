import type { Metadata } from 'next';
import UUIDGeneratorTool from '@/components/tools/UUIDGeneratorTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'UUID Generator - DevToolChest',
  description: 'Generate unique identifiers (UUIDs) in various formats including v1, v4, and more. Free online UUID generator tool.',
  keywords: 'UUID generator, unique identifier, GUID generator, random UUID, UUID v4, UUID v1',
  openGraph: {
    title: 'UUID Generator - DevToolChest',
    description: 'Generate unique identifiers (UUIDs) in various formats',
    type: 'website',
  },
};

export default function UUIDGeneratorPage() {
  return (
    <MainLayout>
      <UUIDGeneratorTool />
    </MainLayout>
  );
}
