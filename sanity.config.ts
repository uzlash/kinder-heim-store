import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

// Slug variants that may exist in Sanity for each URL brand (matches src/lib/sanity.queries.ts)
const HEIM_SLUGS = ['heim', 'heim-kitchenware']
const KINDER_SLUGS = ['kinder', 'kinder-footwear', 'kinder-footware']

function brandFilter(slugs: string[]) {
  return `brand->slug.current in ${JSON.stringify(slugs)}`
}

export default defineConfig({
  name: 'default',
  title: 'Kinder/HEIM Footwear and Kitchenware',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // —— Orders: grouped by status ——
            S.listItem()
              .title('Orders')
              .id('orders')
              .child(
                S.list()
                  .title('Orders by status')
                  .items([
                    S.listItem()
                      .title('Pending')
                      .id('orders-pending')
                      .child(
                        S.documentList()
                          .title('Pending orders')
                          .filter('_type == "order" && status == "pending"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Confirmed')
                      .id('orders-confirmed')
                      .child(
                        S.documentList()
                          .title('Confirmed orders')
                          .filter('_type == "order" && status == "confirmed"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Processing')
                      .id('orders-processing')
                      .child(
                        S.documentList()
                          .title('Processing orders')
                          .filter('_type == "order" && status == "processing"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Shipped')
                      .id('orders-shipped')
                      .child(
                        S.documentList()
                          .title('Shipped orders')
                          .filter('_type == "order" && status == "shipped"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Delivered')
                      .id('orders-delivered')
                      .child(
                        S.documentList()
                          .title('Delivered orders')
                          .filter('_type == "order" && status == "delivered"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Cancelled')
                      .id('orders-cancelled')
                      .child(
                        S.documentList()
                          .title('Cancelled orders')
                          .filter('_type == "order" && status == "cancelled"')
                          .schemaType('order')
                          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                      ),
                  ])
              ),
            S.divider(),
            // —— Content by brand: Products & Categories only (orders are above) ——
            S.listItem()
              .title('Content by brand')
              .id('by-brand')
              .child(
                S.list()
                  .title('Choose a brand')
                  .items([
                    S.listItem()
                      .title('HEIM Kitchenware')
                      .id('brand-heim')
                      .child(
                        S.list()
                          .title('HEIM Kitchenware')
                          .items([
                            S.listItem()
                              .title('Products')
                              .schemaType('product')
                              .child(
                                S.documentList()
                                  .title('HEIM Products')
                                  .filter(`_type == "product" && ${brandFilter(HEIM_SLUGS)}`)
                                  .schemaType('product')
                              ),
                            S.listItem()
                              .title('Categories')
                              .schemaType('category')
                              .child(
                                S.documentList()
                                  .title('HEIM Categories')
                                  .filter(`_type == "category" && ${brandFilter(HEIM_SLUGS)}`)
                                  .schemaType('category')
                              ),
                          ])
                      ),
                    S.listItem()
                      .title('Kinder Footwear')
                      .id('brand-kinder')
                      .child(
                        S.list()
                          .title('Kinder Footwear')
                          .items([
                            S.listItem()
                              .title('Products')
                              .schemaType('product')
                              .child(
                                S.documentList()
                                  .title('Kinder Products')
                                  .filter(`_type == "product" && ${brandFilter(KINDER_SLUGS)}`)
                                  .schemaType('product')
                              ),
                            S.listItem()
                              .title('Categories')
                              .schemaType('category')
                              .child(
                                S.documentList()
                                  .title('Kinder Categories')
                                  .filter(`_type == "category" && ${brandFilter(KINDER_SLUGS)}`)
                                  .schemaType('category')
                              ),
                          ])
                      ),
                  ])
              ),
            S.divider(),
            // —— Global / config ——
            S.listItem()
              .title('Brands')
              .schemaType('brand')
              .child(S.documentTypeList('brand').title('Brands')),
            S.listItem()
              .title('Colors')
              .schemaType('color')
              .child(S.documentTypeList('color').title('Colors')),
            S.listItem()
              .title('Homepages')
              .schemaType('homePage')
              .child(S.documentTypeList('homePage').title('Homepages')),
            S.listItem()
              .title('Site settings')
              .schemaType('siteSettings')
              .child(S.documentTypeList('siteSettings').title('Site settings')),
            S.divider(),
            // —— Other doc types (not brand-scoped) ——
            ...S.documentTypeListItems().filter(
              (item) =>
                !['homePage', 'brand', 'siteSettings', 'product', 'category', 'order', 'color'].includes(
                  item.getId() ?? ''
                )
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
