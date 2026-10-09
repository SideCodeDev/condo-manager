import { Show, UserButton } from '@clerk/tanstack-react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <h1>Welcome to Condo Manager!</h1>
    </main>
  )
}
