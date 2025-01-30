import { AiProvider } from '../contexts/AiContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AiProvider>
          {children}
        </AiProvider>
      </body>
    </html>
  );
} 