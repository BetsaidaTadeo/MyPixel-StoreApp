<template>
  <q-page class="q-pa-md">
    <!-- Filtros horizontales -->
    <div class="row q-col-gutter-md">
      <!-- Rango de precio -->
      <div class="col-12 col-md-auto">
        <q-card flat class="bg-primary text-white full-height" style="border-radius: 12px">
          <q-card-section class="row items-center no-wrap fila-filtro">
            <span class="etiqueta-filtro text-weight-medium">Precio:</span>
            <q-input :model-value="filtros.precioDesde" type="text" inputmode="decimal" prefix="$" outlined dense
              bg-color="white" class="input-precio" @beforeinput="filtrarPrecio"
              @update:model-value="filtros.precioDesde = limpiarPrecio($event)" />
            <span class="etiqueta-filtro text-weight-medium">Hasta:</span>
            <q-input :model-value="filtros.precioHasta" type="text" inputmode="decimal" prefix="$" outlined dense
              bg-color="white" class="input-precio" @beforeinput="filtrarPrecio"
              @update:model-value="filtros.precioHasta = limpiarPrecio($event)" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Ordenar por + botón de filtros (el botón solo aparece en celular) -->
      <div class="col-12 col-md-auto filtro-orden">
        <div class="row no-wrap items-stretch full-height" style="gap: 8px">
          <q-card flat class="bg-primary text-white col col-md-auto" style="border-radius: 12px">
            <q-card-section class="row items-center no-wrap fila-filtro">
              <span class="etiqueta-filtro text-weight-medium">
                {{ $q.screen.lt.sm ? 'Ordenar:' : 'Ordenar por:' }}
              </span>
              <q-btn-toggle v-model="filtros.orden" :options="opcionesOrden" :dense="$q.screen.lt.sm" no-caps unelevated
                color="primary" text-color="white" toggle-color="positive" toggle-text-color="white" />
            </q-card-section>
          </q-card>

          <q-btn v-if="$q.screen.lt.md" unelevated color="primary" icon="filter_alt" aria-label="Filtros"
            style="border-radius: 12px; min-width: 52px" @click="filtros.panelAbierto = true" />
        </div>
      </div>
    </div>

    <!-- Aviso de búsqueda -->
    <div v-if="filtros.busqueda" class="row items-center q-mt-md">
      <span class="text-body1 q-mr-sm">
        {{ celularesFiltrados.length }}
        {{ celularesFiltrados.length === 1 ? 'resultado' : 'resultados' }} para
      </span>
      <q-chip removable color="secondary" text-color="black" class="q-ma-none" @remove="filtros.busqueda = ''">
        {{ filtros.busqueda }}
      </q-chip>
    </div>

    <!-- Tarjetas de celulares -->
    <div class="grid-celulares q-mt-md">
      <q-card v-for="celular in celularesPagina" :key="celular.id" flat bordered class="card-celular column"
        style="border-radius: 8px">
        <q-img v-if="celular.imagen" :src="celular.imagen" :height="alturaFoto" fit="contain"
          class="bg-white cursor-pointer" @click="verDetalle(celular.id)">
          <!-- Si la foto no carga (por ejemplo, no existe en este CouchDB), se muestra el ícono -->
          <template #error>
            <div class="absolute-full flex flex-center bg-grey-2">
              <q-icon name="smartphone" size="56px" color="grey-5" />
            </div>
          </template>
        </q-img>
        <div v-else class="bg-grey-2 flex flex-center cursor-pointer" :style="{ height: alturaFoto }"
          @click="verDetalle(celular.id)">
          <q-icon name="smartphone" size="56px" color="grey-5" />
        </div>

        <q-card-section class="col q-pb-none cursor-pointer" @click="verDetalle(celular.id)">
          <div class="marca-celular">{{ celular.marca }}</div>
          <div class="titulo-celular">{{ celular.titulo }}</div>

          <div class="precio q-mt-sm">
            <span class="precio-simbolo">$</span>
            <span class="precio-entero">{{ celular.precio.toFixed(2).split('.')[0] }}</span>
            <span class="precio-decimales">{{ celular.precio.toFixed(2).split('.')[1] }}</span>
          </div>

          <q-badge color="secondary" text-color="black" :label="celular.estado === 'nuevo' ? 'Nuevo' : 'Usado'"
            class="q-mt-xs" />
        </q-card-section>

        <q-card-section>
          <q-btn unelevated rounded no-caps text-color="black" color="positive" icon="add_shopping_cart"
            label="Agregar al carrito" class="full-width" @click="carrito.agregar(celular)" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Cargando -->
    <div v-if="anuncios.cargando" class="flex flex-center q-my-xl">
      <q-spinner color="primary" size="48px" />
    </div>

    <!-- Sin resultados -->
    <div v-if="anuncios.cargado && !celularesFiltrados.length" class="text-center text-grey-7 q-my-xl">
      <q-icon name="search_off" size="48px" />
      <div class="text-h6">No se encontraron celulares</div>
    </div>

     <!-- Paginación y artículos por página -->
    <div v-if="celularesFiltrados.length" class="row items-center justify-center q-my-lg" style="gap: 16px">
      <q-pagination v-if="totalPaginas > 1" v-model="pagina" :max="totalPaginas" :max-pages="$q.screen.lt.sm ? 5 : 7"
        direction-links :boundary-links="!$q.screen.lt.sm" color="primary" />

      <div class="row items-center no-wrap" style="gap: 8px">
        <span class="text-body2">Artículos por página:</span>
        <q-select v-model="porPagina" :options="opcionesPorPagina" dense outlined options-dense style="width: 90px" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useFiltrosStore } from '@/stores/filtros'
import { useAnunciosStore } from '@/stores/anuncios'
import { useCarritoStore } from '@/stores/carrito'
import { rangoPantalla } from '@/utils/catalogos'

const $q = useQuasar()
const router = useRouter()
const filtros = useFiltrosStore()
const anuncios = useAnunciosStore()
const carrito = useCarritoStore()

const opcionesOrden = [
  { label: 'Precio', value: 'precio', icon: 'arrow_upward' },
  { label: 'Fecha', value: 'fecha' },
]

// Deja solo números y un punto decimal, con máximo 2 decimales (acepta la coma como punto)
function limpiarPrecio(valor) {
  const v = String(valor ?? '')
    .replace(',', '.')
    .replace(/[^0-9.]/g, '')
  const [entero, ...resto] = v.split('.')
  return resto.length ? `${entero}.${resto.join('').slice(0, 2)}` : entero
}

// Bloquea lo que no sea número o punto decimal antes de que aparezca en el campo
function filtrarPrecio(e) {
  const texto = e.data ?? e.dataTransfer?.getData('text') ?? ''
  if (!texto) return // borrar, mover el cursor, etc.

  const campo = e.target
  const actual = campo.value
  const resultado =
    actual.slice(0, campo.selectionStart) +
    texto.replace(',', '.') +
    actual.slice(campo.selectionEnd)

  // Solo dígitos, un punto y máximo 2 decimales
  if (!/^\d*\.?\d{0,2}$/.test(resultado)) e.preventDefault()
}

// La foto es más baja en celular, para que las tarjetas no sean tan grandes
const alturaFoto = computed(() => ($q.screen.lt.sm ? '130px' : '180px'))

function verDetalle(id) {
  router.push(`/anuncio/${id}`)
}

const normalizar = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

// Lista filtrada y ordenada
const celularesFiltrados = computed(() => {
  const f = filtros
  const hay = (v) => v !== '' && v !== null && v !== undefined

  const lista = anuncios.celulares.filter((c) => {
    // Nuevo / Usado: si solo uno está encendido, filtra por ese
    if (f.nuevo && !f.usado && c.estado !== 'nuevo') return false
    if (f.usado && !f.nuevo && c.estado !== 'usado') return false

    // Casillas: si hay alguna marcada, el celular debe coincidir
    if (f.marcasSel.length && !f.marcasSel.includes(c.marca)) return false
    if (f.sistemasSel.length && !f.sistemasSel.includes(c.sistema)) return false
    if (f.pantallasSel.length && !f.pantallasSel.includes(rangoPantalla(c.pantalla))) return false

    // Precio
    if (hay(f.precioDesde) && c.precio < Number(f.precioDesde)) return false
    if (hay(f.precioHasta) && c.precio > Number(f.precioHasta)) return false

    // Búsqueda del header
    if (f.busqueda) {
      const contenido = normalizar(`${c.titulo} ${c.marca} ${c.modelo}`)
      const palabras = normalizar(f.busqueda).split(/\s+/).filter(Boolean)
      if (!palabras.every((p) => contenido.includes(p))) return false
    }

    return true
  })

  // Orden: por precio (menor a mayor) o por fecha (más reciente primero)
  return [...lista].sort((a, b) => (f.orden === 'precio' ? a.precio - b.precio : b.fecha - a.fecha))
})

// Paginación
const pagina = ref(1)
const porPagina = ref(25)
const opcionesPorPagina = [10, 25, 50]

const totalPaginas = computed(() => Math.ceil(celularesFiltrados.value.length / porPagina.value))

const celularesPagina = computed(() => {
  const inicio = (pagina.value - 1) * porPagina.value
  return celularesFiltrados.value.slice(inicio, inicio + porPagina.value)
})

// Al cambiar cualquier filtro, volver a la página 1
watch(celularesFiltrados, () => {
  pagina.value = 1
})
</script>
