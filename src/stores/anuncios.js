import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/boot/firebase'
import { urlImagen } from '@/utils/couch'

export const useAnunciosStore = defineStore('anuncios', () => {
  const celulares = ref([])
  const cargando = ref(false)
  const cargado = ref(false)

  async function cargar(forzar = false) {
    if (cargado.value && !forzar) return
    cargando.value = true
    try {
      const snapshot = await getDocs(collection(db, 'anuncios'))
      celulares.value = snapshot.docs
        .map((d) => {
          const data = d.data()
          const total = Number(data.totalImagenes) || 0
          const imagenes = Array.from({ length: total }, (_, i) => urlImagen(d.id, i))
          return {
            ...data,
            id: d.id,
            precio: Number(data.precio),
            fecha: data.fecha?.toMillis?.() ?? 0,
            imagenes,
            imagen: imagenes[0] ?? data.imagen ?? null,
          }
        })
        .filter((c) => c.titulo)
      cargado.value = true
    } catch (error) {
      console.error('No se pudieron cargar los anuncios:', error)
    } finally {
      cargando.value = false
    }
  }

  function obtenerPorId(id) {
    return celulares.value.find((c) => c.id === String(id))
  }

  return { celulares, cargando, cargado, cargar, obtenerPorId }
})
