<template>
  <q-page class="q-pa-md">
    <div style="max-width: 1100px; margin: 0 auto">
      <div class="text-h5 text-weight-bold q-mb-md">Estadísticas</div>

      <div v-if="anuncios.cargando" class="flex flex-center q-my-xl">
        <q-spinner color="primary" size="48px" />
      </div>

      <div v-else-if="!total" class="text-center text-grey-7 q-my-xl">
        <q-icon name="bar_chart" size="64px" />
        <div class="text-h6 q-mt-md">Todavía no hay anuncios para analizar</div>
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Crear el primero"
          to="/crear"
          class="q-mt-md"
        />
      </div>

      <template v-else>
        <!-- Resumen -->
        <div class="row q-col-gutter-md q-mb-md">
          <div v-for="r in resumen" :key="r.etiqueta" class="col-6 col-md-3">
            <q-card flat bordered class="full-height" style="border-radius: 12px">
              <q-card-section>
                <div class="text-body2 text-grey-8">{{ r.etiqueta }}</div>
                <div class="text-h5 text-weight-bold q-mt-xs">{{ r.valor }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Distribuciones -->
        <div class="row q-col-gutter-md">
          <div v-for="g in grupos" :key="g.titulo" class="col-12 col-md-6">
            <q-card flat bordered class="overflow-hidden full-height" style="border-radius: 12px">
              <q-card-section class="bg-secondary text-black text-subtitle1 text-weight-bold">
                {{ g.titulo }}
              </q-card-section>
              <q-card-section>
                <div v-for="d in g.datos" :key="d.nombre" class="q-mb-md">
                  <div class="row justify-between text-body2 q-mb-xs">
                    <span>{{ d.nombre }}</span>
                    <span class="text-weight-medium">
                      {{ d.cantidad }} ({{ Math.round((d.cantidad / total) * 100) }}%)
                    </span>
                  </div>
                  <q-linear-progress
                    :value="d.cantidad / g.maximo"
                    size="14px"
                    rounded
                    color="light-green-5"
                    track-color="grey-3"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAnunciosStore } from '@/stores/anuncios'
import { rangoPantalla } from '@/utils/catalogos'

const anuncios = useAnunciosStore()

onMounted(() => anuncios.cargar())

const lista = computed(() => anuncios.celulares)
const total = computed(() => lista.value.length)

const dinero = (n) => `$${n.toFixed(2)}`

const resumen = computed(() => {
  const precios = lista.value.map((c) => c.precio)
  const suma = precios.reduce((a, b) => a + b, 0)
  return [
    { etiqueta: 'Anuncios publicados', valor: total.value },
    { etiqueta: 'Precio promedio', valor: dinero(suma / (total.value || 1)) },
    { etiqueta: 'Más barato', valor: dinero(Math.min(...precios)) },
    { etiqueta: 'Más caro', valor: dinero(Math.max(...precios)) },
  ]
})

// Cuenta cuántos anuncios hay por cada valor de un campo, de mayor a menor
function contar(campo, formato = (v) => v) {
  const conteo = {}
  lista.value.forEach((c) => {
    const clave = formato(c[campo]) || 'Sin dato'
    conteo[clave] = (conteo[clave] || 0) + 1
  })
  return Object.entries(conteo)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
}

const grupos = computed(() =>
  [
    {
      titulo: 'Nuevos y usados',
      datos: contar('estado', (v) => (v === 'nuevo' ? 'Nuevo' : 'Usado')),
    },
    { titulo: 'Anuncios por marca', datos: contar('marca') },
    { titulo: 'Anuncios por sistema', datos: contar('sistema') },
    { titulo: 'Anuncios por pantalla (pulgadas)', datos: contar('pantalla', rangoPantalla) },
  ].map((g) => ({ ...g, maximo: Math.max(...g.datos.map((d) => d.cantidad), 1) })),
)
</script>
