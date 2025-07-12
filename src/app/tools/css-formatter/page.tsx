import { Metadata } from 'next';
import CSSFormatterTool from '@/components/tools/CSSFormatterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'CSS Formatter | DevToolChest',
  description: 'Format, beautify, and minify CSS code. Pretty print CSS with proper indentation and organize selectors.',
  keywords: ['css formatter', 'css beautifier', 'css minifier', 'pretty print css', 'css tools'],
};

export default function CSSFormatterPage() {
  return (
    <MainLayout>
      <CSSFormatterTool />
    </MainLayout>
  );
}
