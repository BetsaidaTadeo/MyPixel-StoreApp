import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFiltrosStore = defineStore('filtros', () => {
  const nuevo = ref(false)
  const usado = ref(false)
  const marcasSel = ref([])
  const sistemasSel = ref([])
  const pantallasSel = ref([])
  const precioDesde = ref('')
  const precioHasta = ref('')
  const orden = ref('precio')
  const busqueda = ref('')
  // true = de menor a mayor, false = de mayor a menor
const precioAsc = ref(true)

  // Panel de filtros abierto o cerrado. Está aquí para que el botón de embudo
  // del listado (IndexPage) y el panel (MainLayout) compartan el mismo estado.
  const panelAbierto = ref(false)

  return {
    nuevo,
    usado,
    marcasSel,
    sistemasSel,
    pantallasSel,
    precioDesde,
    precioHasta,
    orden,
    busqueda,
    panelAbierto,
    precioAsc
  }
})
