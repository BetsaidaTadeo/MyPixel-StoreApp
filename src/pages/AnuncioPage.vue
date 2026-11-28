<template>
  <q-page class="q-pa-md">
    <q-page-sticky v-if="celular && $q.screen.lt.md" position="top" expand>
      <div
        class="row items-center no-wrap full-width bg-white q-pa-sm"
        style="border-bottom: 1px solid #ddd"
      >
        <q-btn flat no-caps icon="home" label="Inicio" to="/" />
        <q-space />
        <q-btn
          unelevated
          no-caps
          color="positive"
          text-color="white"
          icon="add_shopping_cart"
          label="Comprar"
          @click="carrito.agregar(celular)"
        />
      </div>
    </q-page-sticky>

    <div
      v-if="celular"
      :class="{ 'q-pt-xl': $q.screen.lt.md }"
      style="max-width: 1100px; margin: 0 auto"
    >
      <q-btn flat dense no-caps to="/" class="q-mb-md">
        <q-icon name="arrow_back" class="q-mr-xs" />
        <span class="text-body1">Volver</span>
      </q-btn>

      <div class="row q-col-gutter-lg">
        <!-- Fotos -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="overflow-hidden" style="border-radius: 12px">
            <q-carousel
              v-if="imagenes.length"
              v-model="slide"
              swipeable
              animated
              infinite
              :arrows="imagenes.length > 1"
              :navigation="imagenes.length > 1"
              control-color="primary"
              height="420px"
              class="bg-white"
            >
              <q-carousel-slide v-for="(img, i) in imagenes" :key="i" :name="i" class="q-pa-none">
                <FotoCelular :src="img" class="fit" />
              </q-carousel-slide>
            </q-carousel>

              <FotoCelular v-else :src="null" height="420px" />
            
          </q-card>
        </div>

        <!-- Información principal -->
        <div class="col-12 col-md-6">
          <q-badge
            rounded
            color="secondary"
            text-color="black"
            :label="celular.estado === 'nuevo' ? 'Nuevo' : 'Usado'"
            style="font-size: 14px; padding: 6px 14px"
          />
          <div class="text-h5 text-weight-medium q-mt-md">{{ celular.titulo }}</div>
          <div class="text-h3 text-weight-bold q-mt-md">${{ celular.precio.toFixed(2) }}</div>

          <q-card flat class="bg-grey-2 q-mt-lg" style="border-radius: 12px">
            <q-card-section class="row items-center no-wrap">
              <q-avatar color="primary" text-color="white" icon="person" />
              <div class="q-ml-md">
                <div class="text-subtitle1 text-weight-medium">{{ celular.vendedor }}</div>
                <div class="text-body2">
                  <q-icon name="phone" color="blue-grey-6" /> {{ celular.telefono }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-btn
            unelevated
            no-caps
            size="lg"
            color="positive"
            text-color="white"
            icon="add_shopping_cart"
            label="Agregar al carrito"
            class="full-width q-mt-md"
            @click="carrito.agregar(celular)"
          />
        </div>
      </div>

      <!-- Especificaciones y descripción -->
      <div class="row q-col-gutter-lg q-mt-sm">
        <div class="col-12 col-md-5">
          <q-card
            flat
            bordered
            class="bg-grey-1 overflow-hidden full-height"
            style="border-radius: 12px"
          >
            <q-card-section class="bg-secondary text-black text-h6 text-weight-bold">
              Especificaciones
            </q-card-section>
            <div
              v-for="fila in especificaciones"
              :key="fila.etiqueta"
              class="row items-center q-px-md q-py-sm fila-espec"
            >
              <div class="col-5 text-grey-9">{{ fila.etiqueta }}</div>
              <div class="col-7 text-weight-medium">{{ fila.valor }}</div>
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-7">
          <q-card
            flat
            bordered
            class="bg-grey-1 overflow-hidden full-height"
            style="border-radius: 12px"
          >
            <q-card-section class="bg-secondary text-black text-h6 text-weight-bold">
              Descripción
            </q-card-section>
            <q-card-section class="text-body1" style="white-space: pre-line; line-height: 1.6">
              {{ celular.descripcion }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Si el id no existe -->
    <div v-else-if="!anuncios.cargado" class="flex flex-center q-my-xl">
      <q-spinner color="primary" size="48px" />
    </div>
    <div v-else class="text-center q-my-xl">
      <q-icon name="error_outline" size="64px" color="grey-6" />
      <div class="text-h6 q-mt-md">No se encontró este anuncio</div>
      <q-btn flat no-caps color="primary" label="Volver al inicio" to="/" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAnunciosStore } from '@/stores/anuncios'
import FotoCelular from '@/components/FotoCelular.vue'

const route = useRoute()
const anuncios = useAnunciosStore()

import { useCarritoStore } from '@/stores/carrito'
const carrito = useCarritoStore()

const celular = computed(() => anuncios.obtenerPorId(route.params.id))

const slide = ref(0)

const imagenes = computed(() => {
  const c = celular.value
  if (!c) return []
  return c.imagenes?.length ? c.imagenes : c.imagen ? [c.imagen] : []
})

const especificaciones = computed(() => {
  const c = celular.value
  if (!c) return []
  return [
    { etiqueta: 'Estado', valor: c.estado === 'nuevo' ? 'Nuevo' : 'Usado' },
    { etiqueta: 'Marca', valor: c.marca },
    { etiqueta: 'Modelo', valor: c.modelo },
    { etiqueta: 'Pantalla', valor: `${c.pantalla} pulgadas` },
    { etiqueta: 'Sistema', valor: c.sistema },
    { etiqueta: 'Rom', valor: c.rom },
    { etiqueta: 'Ram', valor: c.ram },
  ]
})
</script>
