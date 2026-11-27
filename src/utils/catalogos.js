// Fuente única de opciones: la usan el formulario de "Crear anuncio"
// y el panel de filtros del listado. Si agregas una opción aquí,
// aparece en los dos lugares.

export const ESTADOS = [
  { label: 'Nuevo', value: 'nuevo' },
  { label: 'Usado', value: 'usado' },
]

export const MARCAS = ['Samsung', 'Huawei', 'Nokia', 'iPhone', 'Xiaomi']

// "Ios" se escribe así porque es como ya están guardados los anuncios existentes
export const SISTEMAS = ['Android', 'Ios']

// Rangos de pantalla para el filtro del listado.
// En el formulario la medida se escribe a mano (se guarda como texto, ej. '6.1').
export const RANGOS_PANTALLA = ['5.0-5.9', '6.0-6.9', '>6.9']

// Devuelve el rango al que pertenece una pantalla, por ejemplo '6.1' -> '6.0-6.9'
export function rangoPantalla(valor) {
  const n = parseFloat(valor)
  if (Number.isNaN(n) || n < 5) return null
  if (n < 6) return '5.0-5.9'
  if (n <= 6.9) return '6.0-6.9'
  return '>6.9'
}

export const ROMS = ['16 GB', '32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB']

export const RAMS = ['1 GB', '2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '12 GB', '16 GB']

export const MAX_FOTOS = 8
export const MAX_BYTES_FOTO = 5 * 1024 * 1024 // 5 MB
