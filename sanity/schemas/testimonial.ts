import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'WhatsApp testimonial',
  type: 'document',
  description: 'Upload a mobile screenshot of a WhatsApp chat as a testimonial. Each testimonial is tied to a brand.',
  fields: [
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'Which brand this testimonial is for (e.g. Kinder, Heim).',
      validation: (Rule) => Rule.required(),
    } as Parameters<typeof defineField>[0]),
    defineField({
      name: 'screenshot',
      title: 'WhatsApp chat screenshot',
      type: 'image',
      description: 'Mobile screenshot of a WhatsApp conversation (e.g. customer feedback).',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'Short label for this screenshot (e.g. "Customer review – Jan 2025"). Used for accessibility and in the studio list.',
    }),
  ],
  preview: {
    select: {
      media: 'screenshot',
      caption: 'caption',
      brandName: 'brand.name',
    },
    prepare({ media, caption, brandName }) {
      return {
        title: caption || 'WhatsApp screenshot',
        subtitle: brandName ? `Brand: ${brandName}` : undefined,
        media,
      }
    },
  },
})
