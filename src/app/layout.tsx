import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* DVulnDB Header will go here */}
        <div id="__dvulndb">
          {children}
        </div>
        {/* DVulnDB Footer will go here */}
      </body>
    </html>
  );
}
