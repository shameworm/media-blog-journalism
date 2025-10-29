import {defineField, defineType} from 'sanity'

export const largeProjectType = defineType({
  name: 'largeProject',
  title: 'Великі Проекти',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва Проекту',
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
      name: 'description',
      title: 'Опис Проекту',
      type: 'text',
      rows: 4,
      description: 'Короткий опис про що проект',
    }),
    defineField({
      name: 'coverImage',
      title: 'Обкладинка Проекту',
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

    // Співавтори - масив для кількох редакторів/студентів
    defineField({
      name: 'collaborators',
      title: 'Співавтори',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Ім\'я',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (Rule) => Rule.email(),
            },
            {
              name: 'role',
              title: 'Роль в Проекті',
              type: 'string',
              description: 'Наприклад: Автор, Фотограф, Редактор',
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Додайте хоча б одного співавтора'),
      description: 'Додайте всіх студентів/редакторів, які працюють над проектом',
    }),

    // Контент проекту
    defineField({
      name: 'content',
      title: 'Контент Проекту',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Звичайний', value: 'normal'},
            {title: 'Заголовок 1', value: 'h1'},
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
            {
              name: 'source',
              type: 'string',
              title: 'Джерело',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'startedAt',
      title: 'Дата Початку',
      type: 'date',
    }),
    defineField({
      name: 'completedAt',
      title: 'Дата Завершення',
      type: 'date',
    }),

    // Workflow поля
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          {title: 'Чернетка', value: 'draft'},
          {title: 'В Роботі', value: 'in_progress'},
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
      status: 'status',
      media: 'coverImage',
      collaborators: 'collaborators',
    },
    prepare({title, status, media, collaborators}) {
      const statusEmoji = {
        draft: '📝',
        in_progress: '⚙️',
        in_review: '👀',
        changes_requested: '🔄',
        approved: '✅',
        published: '🌟',
      }
      const collaboratorCount = collaborators ? collaborators.length : 0
      return {
        title: title,
        subtitle: `${collaboratorCount} співавтор(ів) | ${statusEmoji[status as keyof typeof statusEmoji] || ''} ${status}`,
        media: media,
      }
    },
  },
})
