import { Show, UserButton } from '@clerk/tanstack-react-start'
import { Button } from '@condo-manager/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Show when="signed-in">
        <UserButton />
      </Show>
      <h1>Welcome to Condo Manager!</h1>
      <Button>HELLO WORLD</Button>
    </main>
  )
}
