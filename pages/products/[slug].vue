<script setup lang="ts">
import { useProductSEO } from '~/entities/product/model/productSEO'

definePageMeta({ layout: 'default' })

const { params: { slug } } = useRoute()

const { product } = await useProductDetailsFetch(Array.isArray(slug) ? slug[0] : slug)

const { locale } = useI18n()

useProductSEO(product)

const hasDiscount = computed(() => product.value ? !!product.value.discountPrice && !!product.value.discountPercent : false)
const activePrice = computed(() => product.value ? product.value.discountPrice ?? product.value.fullPrice : 0)

const IMAGES = Array.from({ length: 7 }, () => (product.value?.image ?? ''))

const mainApi = ref<CarouselApi>()
const thumbsApi = ref<CarouselApi>()

const setMainApi = (api: CarouselApi) => mainApi.value = api
const setThumbsApi = (api: CarouselApi) => thumbsApi.value = api

const scrollTo = (index: number) => mainApi.value?.scrollTo(index)

const activeIndex = ref(0)

watchOnce(mainApi, (api) => {
  if (!api) return

  api.on('select', (instance) => {
    activeIndex.value = instance.selectedScrollSnap()

    thumbsApi.value?.scrollTo(activeIndex.value)
  })
})
</script>

<template>
  <div class="w-full max-w-screen-2xl mx-auto pt-12 px-3 pb-3">
    <div v-if="product"
         class="flex flex-nowrap gap-10 bg-white p-6 rounded-lg shadow-lg max-lg:flex-col max-lg:gap-5 max-sm:p-3"
    >
      <div class="flex-1 space-y-4 transition-opacity max-sm:space-y-2"
           :class="{ 'opacity-0': !mainApi }"
      >
        <SharedCarousel :opts="{ loop: true }"
                        class="w-full rounded-md overflow-hidden max-sm:rounded-sm"
                        @initApi="setMainApi"
        >
          <SharedCarouselContent>
            <SharedCarouselItem v-for="image in IMAGES"
                                :key="image"
            >
              <img :src="image"
                   :alt="product.name"
                   class="w-full h-96 object-cover rounded-md max-lg:h-auto max-md:aspect-video max-sm:rounded-sm"
              >
            </SharedCarouselItem>
          </SharedCarouselContent>
        </SharedCarousel>

        <SharedCarousel :opts="{ loop: true, containScroll: 'keepSnaps', dragFree: true }"
                        class="rounded-md overflow-hidden max-sm:rounded-sm"
                        @initApi="setThumbsApi"
        >
          <SharedCarouselContent>
            <SharedCarouselItem v-for="(image, index) in IMAGES"
                                :key="image"
                                class="basis-1/5 transition-opacity max-sm:basis-1/4 max-sm:pl-2"
                                :class="[
                                  activeIndex === index ? 'opacity-100' : 'opacity-25',
                                ]"
                                @click="scrollTo(index)"
            >
              <img :src="image"
                   :alt="product.name"
                   class="object-cover w-full rounded-md max-sm:rounded-sm"
              >
            </SharedCarouselItem>
          </SharedCarouselContent>
        </SharedCarousel>
      </div>
      <div class="flex-1 text-sm whitespace-break-spaces">
        <div class="text-lg text-foreground/45 font-nunito mb-3">
          {{ product.category.name }}
        </div>

        <h1 class="text-5xl font-medium text-foreground font-rubik mb-8">
          {{ product.name }}
        </h1>

        <div v-if="activePrice"
             class="flex space-x-2 mb-5 items-center"
        >
          <ProductPrice :price="activePrice"
                        :type="hasDiscount ? 'accent' : 'default'"
          />
          <ProductDiscount v-if="product.discountPercent"
                           :percent="product.discountPercent"
          />
          <ProductPrice v-if="hasDiscount"
                        :price="product.fullPrice"
                        strikeThrough
          />
        </div>

        <div class="font-nunito text-base font-normal">
          {{ locale === 'ru' ? product.description.ru : product.description.en }}
        </div>

        <SharedSeparator class="my-9" />

        <div class="flex mb-5 max-sm:flex-col max-sm:space-y-5">
          <div class="flex-1 min-w-fit">
            <div class="font-nunito font-bold leading-none mb-2">
              Colors:
            </div>
            <ProductColors :colors="product.colors" />
          </div>

          <div class="flex-1 min-w-fit">
            <div class="font-nunito font-bold leading-none mb-2">
              Reviews:
            </div>
            <ProductRating v-if="product.rating"
                           :rating="product.rating"
            />
          </div>
        </div>

        <div>
          <div class="font-nunito font-bold leading-none mb-2">
            Sizes:
          </div>
          <ProductSizes :availableSizes="product.sizes"
                        :highlighted="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
