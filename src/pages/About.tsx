function About() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 overflow-y-auto p-6">
      <h1>About Dyslexia PDF Reader:</h1>

      <p>
        Dyslexia PDF Reader is a free, open-source web tool designed to help people with dyslexia
        and other reading disabilities read PDF documents more comfortably.
      </p>

      <p>
        Many existing PDF readers and accessibility tools are either locked behind paywalls, or
        limited by trials. This project exists to provide a transparent, free alternative.
      </p>

      <h2>Who This Tool Is For?</h2>
      <ul className="list-inside list-disc space-y-2">
        <li>People with dyslexia</li>
        <li>Students who struggle to read documents in their original format</li>
        <li>Users who don't want to pay to read comfortably</li>
      </ul>

      <h2>Accessibility-First Design</h2>
      <p>
        The reader focuses on reducing visual crowding, improving readability, and supporting
        alternative reading workflows. The interface is designed to work with keyboard navigation
        and ARIA standards.
      </p>

      <h2>Free and Open Source!!</h2>
      <p>
        Dyslexia PDF Reader is completely free and open source. There are no ads, subscriptions, or
        file uploads to third-party servers. All processing happens locally in your browser.
      </p>

      <a
        href="/Dyslexia-PDF-Reader/"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Launch Dyslexia PDF Reader
      </a>
    </main>
  );
}

export default About;
