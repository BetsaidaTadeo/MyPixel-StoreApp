import { api } from '@/boot/axios'

// Nombre de la base de datos de imágenes en CouchDB
const COLECCION = '/fpi-imagenes/'

// Las imágenes de cada anuncio se llaman archivo0.jpg, archivo1.jpg, ...
export function nombreImagen(indice) {
  return `archivo${indice}.jpg`
}
// URL completa de una imagen: servidor + base + ID del anuncio + nombre
export function urlImagen(idDocumento, indice = 0) {
  return `${api.defaults.baseURL}${COLECCION}${idDocumento}/${nombreImagen(indice)}`
}

// Sube todas las imágenes como "attachments" de un documento con el ID del anuncio.
// La primera subida crea el documento y cada subida siguiente debe enviar
// la revisión (rev) que devolvió la anterior.
export async function subirImagenes(idDocumento, archivos) {
  let rev = null

  for (let i = 0; i < archivos.length; i++) {
    const archivo = archivos[i]
    const ruta = `${COLECCION}${idDocumento}/${nombreImagen(i)}`

    const respuesta = await api.put(rev ? `${ruta}?rev=${rev}` : ruta, archivo, {
      headers: { 'Content-Type': archivo.type },
    })

    rev = respuesta.data.rev
  }
}
