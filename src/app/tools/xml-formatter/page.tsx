import { Metadata } from 'next';
import XMLFormatterTool from '@/components/tools/XMLFormatterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'XML Formatter | CoderTools',
  description: 'Format, validate, and beautify XML data. Pretty print XML with proper indentation and syntax highlighting.',
  keywords: ['xml formatter', 'xml validator', 'xml beautifier', 'pretty print xml', 'xml tools'],
};

export default function XMLFormatterPage() {
  return (
    <MainLayout>
      <XMLFormatterTool />
    </MainLayout>
  );
}
