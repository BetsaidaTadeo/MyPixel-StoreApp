<template>
  <q-layout view="lHh LpR lff">
    <q-header elevated>
      <q-toolbar>
        <!-- Celular: abre el menú principal. Computador: abre/cierra el panel de filtros -->
        <q-btn
          v-if="movil || esListado"
          :size="movil ? 'md' : 'lg'"
          flat
          dense
          round
          icon="menu"
          :aria-label="movil ? 'Menú principal' : 'Filtros'"
          @click="alternarMenu"
        />

        <!-- En celular el título va dentro del menú principal, como en el diseño -->
        <q-toolbar-title v-if="!movil" shrink class="app-title"> MY PIXEL-STORE </q-toolbar-title>

        <q-input
          v-model="text"
          rounded
          outlined
          bg-color="white"
          dense
          input-class="text-left"
          placeholder="Buscar productos"
          class="col buscador-header"
          clearable
          @keyup.enter="buscar"
          @clear="limpiarBusqueda"
          @update:model-value="mostrarSugerencias = !!$event"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" @click="buscar" />
          </template>

          <q-menu
            v-if="sugerencias.length"
            v-model="mostrarSugerencias"
            no-parent-event
            no-focus
            no-refocus
            fit
          >
            <q-list>
              <q-item v-for="s in sugerencias" :key="s" clickable @click="elegirSugerencia(s)">
                <q-item-section avatar>
                  <q-icon name="search" color="grey-6" />
                </q-item-section>
                <q-item-section>{{ s }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-input>

        <!-- Solo computador: botones con texto -->
        <template v-if="!movil">
          <q-space />
          <q-btn
            v-for="e in enlaces"
            :key="e.to"
            flat
            no-caps
            :icon="e.icono"
            :label="e.label"
            :to="e.to"
          >
            <q-badge
              v-if="e.to === '/carrito' && carrito.cantidad"
              color="light-green-5"
              text-color="black"
              floating
            >
              {{ carrito.cantidad }}
            </q-badge>
          </q-btn>
        </template>
      </q-toolbar>
    </q-header>

    <!-- Menú principal (solo celular), se abre con el botón ≡ -->
    <q-drawer
      v-if="movil"
      v-model="menuAbierto"
      side="right"
      behavior="mobile"
      bordered
      :width="260"
    >
      <div class="q-pa-md">
        <div class="app-title text-primary" style="font-size: 1.4rem">MY PIXEL-STORE</div>
      </div>
      <q-separator />
      <q-list>
        <q-item
          v-for="e in enlaces"
          :key="e.to"
          clickable
          exact
          :to="e.to"
          @click="menuAbierto = false"
        >
          <q-item-section avatar>
            <q-icon :name="e.icono" />
          </q-item-section>
          <q-item-section>{{ e.label }}</q-item-section>
          <q-item-section v-if="e.to === '/carrito' && carrito.cantidad" side>
            <q-badge color="light-green-5" text-color="black">{{ carrito.cantidad }}</q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Panel de filtros. En celular se abre con el botón de embudo del listado -->
    <q-drawer
      v-if="esListado"
      v-model="filtros.panelAbierto"
      show-if-above
      :width="280"
      class="bg-primary"
    >
      <div class="q-pa-md">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-h6 text-white">Filtrar por:</div>
          <q-btn
            v-if="movil"
            flat
            round
            dense
            icon="close"
            color="white"
            aria-label="Cerrar filtros"
            @click="filtros.panelAbierto = false"
          />
        </div>

        <q-card flat class="overflow-hidden q-mb-md" style="border-radius: 12px">
          <div class="column">
            <q-toggle v-model="filtros.nuevo" label="Nuevo" color="secondary" />
            <q-toggle v-model="filtros.usado" label="Usado" color="secondary" />
          </div>
        </q-card>

        <!-- Marca, Sistema y Pantalla salen de utils/catalogos.js -->
        <q-card
          v-for="g in grupos"
          :key="g.campo"
          flat
          class="overflow-hidden q-mb-md"
          style="border-radius: 12px"
        >
          <q-expansion-item dense dense-toggle expand-separator :label="g.titulo" default-opened>
            <q-card-section class="q-pt-none">
              <div class="q-gutter-sm column">
                <q-checkbox
                  v-for="op in g.opciones"
                  :key="op.nombre"
                  v-model="filtros[g.seleccion]"
                  :val="op.nombre"
                  :label="`${op.nombre} (${op.cantidad})`"
                  :disable="!op.cantidad && !filtros[g.seleccion].includes(op.nombre)"
                  dense
                  color="secondary"
                />
              </div>
            </q-card-section>
          </q-expansion-item>
        </q-card>

        <q-btn
          v-if="movil"
          unelevated
          no-caps
          color="secondary"
          text-color="black"
          label="Ver resultados"
          class="full-width"
          @click="filtros.panelAbierto = false"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-primary text-white">
      <div class="text-center q-pa-sm text-body2">
        MY PIXEL-STORE, app desarrollada para el trabajo final "Cellphone ebay" por
        <strong>Betsaida Marlene Tadeo Mangandí, correo: tm24002@ues.edu.sv </strong> noviembre de
        2026
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useFiltrosStore } from '@/stores/filtros'
import { useAnunciosStore } from '@/stores/anuncios'
import { useCarritoStore } from '@/stores/carrito'
import { MARCAS, SISTEMAS, RANGOS_PANTALLA, rangoPantalla } from '@/utils/catalogos'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const filtros = useFiltrosStore()
const anuncios = useAnunciosStore()
const carrito = useCarritoStore()

const esListado = computed(() => route.path === '/')
const movil = computed(() => $q.screen.lt.md)

const enlaces = [
  { label: 'Inicio', icono: 'home', to: '/' },
  { label: 'Crear anuncio', icono: 'add_photo_alternate', to: '/crear' },
  { label: 'Carrito', icono: 'add_shopping_cart', to: '/carrito' },
  { label: 'Estadísticas', icono: 'bar_chart', to: '/estadisticas' },
]

// Menú principal (celular)
const menuAbierto = ref(false)

function alternarMenu() {
  if (movil.value) menuAbierto.value = !menuAbierto.value
  else filtros.panelAbierto = !filtros.panelAbierto
}

// Casillas del panel: las opciones vienen del catálogo y los números
// de cada una se calculan con los anuncios que realmente existen.
function contar(valorDe) {
  const conteo = {}
  anuncios.celulares.forEach((c) => {
    const clave = valorDe(c)
    conteo[clave] = (conteo[clave] || 0) + 1
  })
  return conteo
}

const grupos = computed(() =>
  [
    {
      titulo: 'Marca',
      campo: 'marca',
      seleccion: 'marcasSel',
      catalogo: MARCAS,
      valorDe: (c) => c.marca,
    },
    {
      titulo: 'Sistema',
      campo: 'sistema',
      seleccion: 'sistemasSel',
      catalogo: SISTEMAS,
      valorDe: (c) => c.sistema,
    },
    {
      titulo: 'Pantalla (pulgadas)',
      campo: 'pantalla',
      seleccion: 'pantallasSel',
      catalogo: RANGOS_PANTALLA,
      valorDe: (c) => rangoPantalla(c.pantalla),
    },
  ].map((g) => {
    const conteo = contar(g.valorDe)
    return {
      ...g,
      opciones: g.catalogo.map((nombre) => ({ nombre, cantidad: conteo[nombre] ?? 0 })),
    }
  }),
)

// Buscador del header
const text = ref('')
const mostrarSugerencias = ref(false)

const normalizar = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const sugerencias = computed(() => {
  const t = normalizar(text.value).trim()
  if (!t) return []

  const opciones = new Set()
  anuncios.celulares.forEach((c) => {
    opciones.add(c.marca)
    opciones.add(`${c.marca} ${c.modelo}`)
  })

  return [...opciones]
    .filter((o) => normalizar(o).includes(t))
    .sort((a, b) => Number(normalizar(b).startsWith(t)) - Number(normalizar(a).startsWith(t)))
    .slice(0, 6)
})

function buscar() {
  mostrarSugerencias.value = false
  filtros.busqueda = (text.value || '').trim()
  if (route.path !== '/') router.push('/')
}

function elegirSugerencia(s) {
  text.value = s
  buscar()
}

function limpiarBusqueda() {
  text.value = ''
  filtros.busqueda = ''
}

// Si la búsqueda se quita desde otro lugar (el chip del listado), el campo se vacía también
watch(
  () => filtros.busqueda,
  (nuevo) => {
    text.value = nuevo
  },
)

onMounted(() => anuncios.cargar())
</script>
