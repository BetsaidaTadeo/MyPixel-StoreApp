import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'

const CLAVE = 'pixel-store-carrito'
export const MAX_UNIDADES = 99

function leerGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE)) || []
    // Los carritos guardados antes de existir las cantidades no traen "cantidad": cuentan como 1
    return guardado.map((i) => ({
      ...i,
      precio: Number(i.precio),
      cantidad: Math.min(Math.max(Number(i.cantidad) || 1, 1), MAX_UNIDADES),
    }))
  } catch {
    return []
  }
}

export const useCarritoStore = defineStore('carrito', () => {
  // Cada producto aparece una sola vez en la lista, con su cantidad de unidades
  const items = ref(leerGuardado())

  // Total de unidades (es el número que se ve en el encabezado)
  const cantidad = computed(() => items.value.reduce((suma, i) => suma + i.cantidad, 0))
  const total = computed(() => items.value.reduce((suma, i) => suma + i.precio * i.cantidad, 0))

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

  function agregar(celular) {
    const existente = items.value.find((i) => i.id === celular.id)

    if (existente) {
      if (existente.cantidad >= MAX_UNIDADES) {
        Notify.create({
          type: 'warning',
          message: `Máximo ${MAX_UNIDADES} unidades de este celular`,
          timeout: 2000,
        })
        return
      }
      existente.cantidad++
      Notify.create({
        type: 'positive',
        message: `Otra unidad agregada (${existente.cantidad} en el carrito)`,
        timeout: 2000,
      })
      return
    }

    items.value.push({
      id: celular.id,
      titulo: celular.titulo,
      marca: celular.marca,
      estado: celular.estado,
      precio: Number(celular.precio),
      imagen: celular.imagen ?? null,
      cantidad: 1,
    })
    Notify.create({ type: 'positive', message: 'Agregado al carrito', timeout: 2000 })
  }

  // Suma o resta unidades (cambio = 1 o -1). Nunca baja de 1: para sacarlo se usa "Quitar".
  function cambiarCantidad(id, cambio) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    item.cantidad = Math.min(Math.max(item.cantidad + cambio, 1), MAX_UNIDADES)
  }

  function quitar(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function vaciar() {
    items.value = []
  }

  return { items, cantidad, total, agregar, cambiarCantidad, quitar, vaciar }
})
