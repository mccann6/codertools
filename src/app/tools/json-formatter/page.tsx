import type { Metadata } from 'next';
import JSONFormatterTool from '@/components/tools/JSONFormatterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - CoderTools',
  description: 'Format, validate, and beautify JSON data with syntax highlighting. Free online JSON formatter tool that works in your browser.',
  keywords: 'JSON formatter, JSON validator, JSON beautifier, JSON parser, format JSON online',
  openGraph: {
    title: 'JSON Formatter & Validator - CoderTools',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    type: 'website',
  },
};

export default function JSONFormatterPage() {
  return (
    <MainLayout>
      <JSONFormatterTool />
    </MainLayout>
  );
}
