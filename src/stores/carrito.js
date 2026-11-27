import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'

const CLAVE = 'pixel-store-carrito'

function leerGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

export const useCarritoStore = defineStore('carrito', () => {
  // Cada anuncio es único (un solo celular), así que no hay cantidades:
  // está en el carrito o no está.
  const items = ref(leerGuardado())

  const cantidad = computed(() => items.value.length)
  const total = computed(() => items.value.reduce((suma, i) => suma + i.precio, 0))

  // Se guarda en el navegador para que el carrito sobreviva a recargar la página
  watch(
    items,
    (valor) => {
      try {
        localStorage.setItem(CLAVE, JSON.stringify(valor))
      } catch {
        /* sin acceso a localStorage: el carrito sigue funcionando en memoria */
      }
    },
    { deep: true },
  )

  function estaEnCarrito(id) {
    return items.value.some((i) => i.id === id)
  }

  function agregar(celular) {
    if (estaEnCarrito(celular.id)) {
      Notify.create({ type: 'info', message: 'Este celular ya está en tu carrito', timeout: 2000 })
      return
    }
    items.value.push({
      id: celular.id,
      titulo: celular.titulo,
      marca: celular.marca,
      estado: celular.estado,
      precio: Number(celular.precio),
      imagen: celular.imagen ?? null,
    })
    Notify.create({ type: 'positive', message: 'Agregado al carrito', timeout: 2000 })
  }

  function quitar(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function vaciar() {
    items.value = []
  }

  return { items, cantidad, total, estaEnCarrito, agregar, quitar, vaciar }
})
