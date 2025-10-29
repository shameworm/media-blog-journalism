import {defineField, defineType} from 'sanity'

export const reflectionType = defineType({
  name: 'reflection',
  title: 'Рефлексії (Есе Студентів)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва Есе',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studentName',
      title: 'Ім\'я Студента',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Повне ім\'я студента, який написав есе',
    }),
    defineField({
      name: 'studentEmail',
      title: 'Email Студента',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'relatedBiography',
      title: 'Біографія Журналіста',
      type: 'reference',
      to: [{type: 'biography'}],
      validation: (Rule) => Rule.required(),
      description: 'Оберіть журналіста, про якого написано есе',
    }),
    defineField({
      name: 'essay',
      title: 'Текст Есе',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Звичайний', value: 'normal'},
            {title: 'Заголовок 2', value: 'h2'},
            {title: 'Заголовок 3', value: 'h3'},
            {title: 'Цитата', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Жирний', value: 'strong'},
              {title: 'Курсив', value: 'em'},
              {title: 'Підкреслений', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Посилання',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        },
        {
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
            {
              name: 'caption',
              type: 'string',
              title: 'Підпис',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Дата Подання',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // Workflow поля
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          {title: 'Чернетка', value: 'draft'},
          {title: 'На Розгляді', value: 'in_review'},
          {title: 'Потребує Змін', value: 'changes_requested'},
          {title: 'Схвалено', value: 'approved'},
          {title: 'Опубліковано', value: 'published'},
        ],
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'assignedChiefEditor',
      title: 'Головний Редактор для Перевірки',
      type: 'string',
      description: 'Ім\'я або email головного редактора',
    }),
    defineField({
      name: 'grade',
      title: 'Оцінка',
      type: 'string',
      description: 'Оцінка або відгук від головного редактора',
    }),
    defineField({
      name: 'comments',
      title: 'Коментарі',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'author',
              title: 'Автор',
              type: 'string',
            },
            {
              name: 'text',
              title: 'Текст Коментаря',
              type: 'text',
              rows: 3,
            },
            {
              name: 'createdAt',
              title: 'Дата Створення',
              type: 'datetime',
              initialValue: () => new Date().toISOString(),
            },
            {
              name: 'resolved',
              title: 'Вирішено',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'text',
              resolved: 'resolved',
            },
            prepare({title, subtitle, resolved}) {
              return {
                title: `${resolved ? '✓' : '○'} ${title}`,
                subtitle: subtitle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'revisionHistory',
      title: 'Історія Змін Статусу',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'status',
              title: 'Статус',
              type: 'string',
            },
            {
              name: 'changedBy',
              title: 'Змінено Користувачем',
              type: 'string',
            },
            {
              name: 'changedAt',
              title: 'Дата Зміни',
              type: 'datetime',
            },
            {
              name: 'note',
              title: 'Примітка',
              type: 'text',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'studentName',
      status: 'status',
      biography: 'relatedBiography.fullName',
    },
    prepare({title, subtitle, status, biography}) {
      const statusEmoji = {
        draft: '📝',
        in_review: '👀',
        changes_requested: '🔄',
        approved: '✅',
        published: '🌟',
      }
      return {
        title: title,
        subtitle: `${subtitle} → ${biography || 'Не обрано'} | ${statusEmoji[status as keyof typeof statusEmoji] || ''} ${status}`,
      }
    },
  },
})
