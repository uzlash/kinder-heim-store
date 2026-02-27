import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'authorImg',
      title: 'Author Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'review',
      title: 'Review',
      type: 'text',
    }),
  ],
})
