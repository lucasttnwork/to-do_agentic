import type { Metadata } from "next";
import { Inter, Roboto_Mono } from 'next/font/google';
import "./globals.css";
import { Theme, ThemePanel } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: "Todo AI SaaS",
  description: "Sistema de gerenciamento de tarefas com inteligência artificial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${robotoMono.variable}`}>
      <body className="antialiased">
        <Theme appearance="dark" accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
          {children}
        </Theme>
      </body>
    </html>
  );
}
