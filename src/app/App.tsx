import { useState } from 'react'
import { PantallaBienvenida } from '@/features/bienvenida/PantallaBienvenida'
import { PaginaInicio } from '@/features/inicio/PaginaInicio'

function App() {
  // La bienvenida aparece cada vez que se abre la app.
  const [enBienvenida, setEnBienvenida] = useState(true)

  if (enBienvenida) {
    return <PantallaBienvenida alComenzar={() => setEnBienvenida(false)} />
  }
  return <PaginaInicio />
}

export default App
