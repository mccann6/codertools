import { Metadata } from 'next';
import PasswordGeneratorTool from '@/components/tools/PasswordGeneratorTool';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Password Generator | DevToolChest',
  description: 'Generate secure, random passwords with customizable length and character sets. Create strong passwords for better security.',
  keywords: ['password generator', 'secure password', 'random password', 'password strength', 'security tools'],
};

export default function PasswordGeneratorPage() {
  return (
    <MainLayout>
      <PasswordGeneratorTool />
    </MainLayout>
  );
}
