import 'bootstrap/dist/css/bootstrap.css';
import './../index.css';

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {

    let bootstrapScript = '';
    if (process.env.NODE_ENV === 'development') {
        bootstrapScript = '/assets/bootstrap.bundle.js';
    } else {
        bootstrapScript = '/assets/bootstrap.bundle.min.js';
    }

    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src={bootstrapScript} async={true} />
        </head>
        <body className="container-fluid">{children}</body>
      </html>
    );
}
