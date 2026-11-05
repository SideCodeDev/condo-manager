import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { ClerkProvider } from '@clerk/tanstack-react-start'
import appCss from '@condo-manager/ui/styles.css?url'

const allowedRedirectOrigins = (import.meta.env.VITE_CLERK_ALLOWED_REDIRECT_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Condo Manager',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <ClerkProvider allowedRedirectOrigins={allowedRedirectOrigins}>
          {children}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
