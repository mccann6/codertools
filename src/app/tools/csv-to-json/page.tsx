import type { Metadata } from 'next';
import CSVToJSONTool from '@/components/tools/CSVToJSONTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter - CoderTools',
  description: 'Convert CSV data to JSON format online. Free CSV to JSON converter with customizable options and data preview.',
  keywords: 'CSV to JSON, convert CSV, CSV converter, CSV parser, data conversion, JSON format',
  openGraph: {
    title: 'CSV to JSON Converter - CoderTools',
    description: 'Convert CSV data to JSON format online',
    type: 'website',
  },
};

export default function CSVToJSONPage() {
  return (
    <MainLayout>
      <CSVToJSONTool />
    </MainLayout>
  );
}
