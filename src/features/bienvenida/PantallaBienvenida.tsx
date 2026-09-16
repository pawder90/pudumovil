/**
 * Portada que aparece cada vez que se abre la app: isologo de Pudumóvil,
 * una bajada corta y el botón "Comenzar", que lleva al camino de niveles.
 */
import { Boton } from '@/components'
import './pantalla-bienvenida.css'

type Props = {
  alComenzar: () => void
}

export function PantallaBienvenida({ alComenzar }: Props) {
  return (
    <main className="pantalla-bienvenida">
      <h1 className="pantalla-bienvenida-titulo">Pudumóvil</h1>

      <div className="pantalla-bienvenida-centro">
        <div className="pantalla-bienvenida-isologo">
          <div className="pantalla-bienvenida-personaje">
            <img src="/marca/pudumovil-isologo-personaje.png" alt="" />
          </div>
          <img
            className="pantalla-bienvenida-wordmark"
            src="/marca/pudumovil-wordmark-recortado.svg"
            alt=""
            width={874}
            height={165}
          />
        </div>
        <p className="pantalla-bienvenida-bajada">
          Prepárate para tu examen de licencia clase B
        </p>
      </div>

      <div className="pantalla-bienvenida-accion">
        <Boton anchoCompleto onClick={alComenzar}>
          Comenzar
        </Boton>
      </div>
    </main>
  )
}
