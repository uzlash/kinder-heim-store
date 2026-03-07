import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Compare at Price',
      type: 'number',
      description: 'Original price for showing discounts',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Optional multiple images. Add one or more.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'Select which brand this product belongs to (e.g. HEIM or Kinder Footwear).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit',
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory Count',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Color Name',
              type: 'string',
            },
            {
              name: 'value',
              title: 'Color Code',
              type: 'string',
              description: 'Hex color code (e.g., #000000)',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes (global fallback)',
      type: 'array',
      description: 'Used when colorVariants is empty. Otherwise sizes come from each color variant.',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
    }),
    defineField({
      name: 'colorVariants',
      title: 'Sizes per color',
      type: 'array',
      description: 'When set, each color shows its own available sizes when clicked. Leave empty to use Colors + Sizes globally.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'color',
              title: 'Color',
              type: 'object',
              fields: [
                { name: 'name', title: 'Color name', type: 'string' },
                { name: 'value', title: 'Hex (e.g. #000)', type: 'string' },
              ],
            },
            {
              name: 'sizes',
              title: 'Sizes for this color',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' },
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'policy',
      title: 'Policy',
      type: 'text',
      rows: 4,
      description: 'Return / shipping policy or other policy text for this product.',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'E.g. 2348012345678 (country code, no +). Used for Contact / Chat link.',
    }),
    defineField({
      name: 'deliveryInfo',
      title: 'Delivery info',
      type: 'string',
      description: 'Override default. Default: "24 hrs max within Abuja. Saturdays for interstate deliveries."',
    }),
    defineField({
      name: 'productOfMonth',
      title: 'Product of the Month',
      type: 'boolean',
      description: 'Highlight this product as the Product of the Month in hero and listings. Prefer only one at a time.',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show this product in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Best Seller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Out of Stock', value: 'out_of_stock' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'active',
    }),
    defineField({
      name: 'reviews',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'rating',
      title: 'Average Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      inventory: 'inventory',
    },
    prepare(selection) {
      const { title, media, price, inventory } = selection
      return {
        title,
        subtitle: `$${price} - Stock: ${inventory}`,
        media,
      }
    },
  },
})
