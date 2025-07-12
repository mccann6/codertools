import { Metadata } from 'next';
import LoremIpsumTool from '@/components/tools/LoremIpsumTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator | CoderTools',
  description: 'Generate Lorem Ipsum placeholder text for design and development. Customize length, format, and starting text.',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lipsum', 'text generator', 'design tools'],
};

export default function LoremIpsumPage() {
  return (
    <MainLayout>
      <LoremIpsumTool />
    </MainLayout>
  );
}
