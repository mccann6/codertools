import { Metadata } from 'next';
import ColorConverterTool from '@/components/tools/ColorConverterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Color Converter | CoderTools',
  description: 'Convert between color formats: HEX, RGB, HSL, HSV. Visual color picker and palette generator for web development.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hsl', 'color picker', 'color palette', 'web colors'],
};

export default function ColorConverterPage() {
  return (
    <MainLayout>
      <ColorConverterTool />
    </MainLayout>
  );
}
