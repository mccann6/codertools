import { Metadata } from 'next';
import JSONToCSVTool from '@/components/tools/JSONToCSVTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter | DevToolChest',
  description: 'Convert JSON data to CSV format. Handle nested objects, arrays, and customize output format for data processing.',
  keywords: ['json to csv', 'data converter', 'json converter', 'csv export', 'data transformation'],
};

export default function JSONToCSVPage() {
  return (
    <MainLayout>
      <JSONToCSVTool />
    </MainLayout>
  );
}
