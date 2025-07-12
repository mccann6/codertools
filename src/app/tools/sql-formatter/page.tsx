import { Metadata } from 'next';
import SQLFormatterTool from '@/components/tools/SQLFormatterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'SQL Formatter | CoderTools',
  description: 'Format, beautify, and organize SQL queries with proper indentation and syntax highlighting for better readability.',
  keywords: ['sql formatter', 'sql beautifier', 'format sql', 'sql query formatter', 'database tools'],
};

export default function SQLFormatterPage() {
  return (
    <MainLayout>
      <SQLFormatterTool />
    </MainLayout>
  );
}
