import type { Metadata } from 'next'
import Script from 'next/script'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '700', '800'] })

export const metadata: Metadata = {
  title: 'Nexus - Conectando Suas Finanças ao Futuro',
  description: 'Plataforma inteligente de simulação financeira que conecta suas decisões de hoje com seus objetivos futuros',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" lang="pt-BR">
      <body className={`bg-background-light dark:bg-background-dark ${manrope.className}`}>
        <Script 
          src="https://cdn.tailwindcss.com?plugins=forms,container-queries" 
          strategy="beforeInteractive"
        />
        <Script id="tailwind-config" strategy="beforeInteractive">
          {`
            window.addEventListener('load', function() {
              if (typeof tailwind !== 'undefined') {
                tailwind.config = {
                  darkMode: "class",
                  theme: {
                    extend: {
                      colors: {
                        primary: "#00A3FF",
                        "background-light": "#f6f7f8",
                        "background-dark": "#0D1117",
                        "surface-dark": "#161B22",
                        "border-dark": "#30363D",
                        "text-primary-dark": "#C9D1D9",
                        "text-secondary-dark": "#8B949E"
                      },
                      fontFamily: {
                        display: ["Manrope"],
                      },
                      borderRadius: {
                        DEFAULT: "0.25rem",
                        lg: "0.5rem",
                        xl: "0.75rem",
                        full: "9999px"
                      },
                    },
                  },
                };
              }
            });
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
