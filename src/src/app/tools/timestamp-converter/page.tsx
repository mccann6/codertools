import { Metadata } from 'next';
import TimestampConverterTool from '@/components/tools/TimestampConverterTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter | DevToolChest',
  description: 'Convert Unix timestamps to human-readable dates and vice versa. Support for milliseconds and various date formats.',
  keywords: ['unix timestamp', 'timestamp converter', 'epoch time', 'date converter', 'time conversion'],
};

export default function TimestampConverterPage() {
  return (
    <MainLayout>
      <TimestampConverterTool />
    </MainLayout>
  );
}
