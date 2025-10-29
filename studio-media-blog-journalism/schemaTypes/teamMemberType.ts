import {defineField, defineType} from 'sanity'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Члени Команди',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Повне Ім\'я',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Фото',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Альтернативний текст',
        },
      ],
    }),
    defineField({
      name: 'role',
      title: 'Роль',
      type: 'string',
      description: 'Наприклад: Головний редактор, Журналіст, Фотограф',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Коротка Біографія',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Соціальні Мережі',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Платформа',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Інше', value: 'other'},
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
