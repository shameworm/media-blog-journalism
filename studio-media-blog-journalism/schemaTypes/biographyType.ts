import {defineField, defineType} from 'sanity'

export const biographyType = defineType({
  name: 'biography',
  title: 'Біографії Журналістів',
  type: 'document',
  fields: [
    // Основна інформація
    defineField({
      name: 'fullName',
      title: 'Повне Ім\'я та Прізвище',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'fullName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Фото Журналіста',
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
      validation: (Rule) => Rule.required(),
    }),

    // Дати та місця
    defineField({
      name: 'birthDate',
      title: 'Дата Народження',
      type: 'date',
    }),
    defineField({
      name: 'birthPlace',
      title: 'Місце Народження',
      type: 'string',
    }),
    defineField({
      name: 'deathDate',
      title: 'Дата Загибелі',
      type: 'date',
      description: 'Залиште порожнім, якщо журналіст живий',
    }),
    defineField({
      name: 'deathPlace',
      title: 'Місце Загибелі',
      type: 'string',
    }),

    // Освіта та робота
    defineField({
      name: 'education',
      title: 'Освіта',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'institution',
              title: 'Навчальний Заклад',
              type: 'string',
            },
            {
              name: 'degree',
              title: 'Ступінь/Спеціальність',
              type: 'string',
            },
            {
              name: 'year',
              title: 'Рік Закінчення',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'workplaces',
      title: 'Місця Роботи',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'organization',
              title: 'Організація/Медіа',
              type: 'string',
            },
            {
              name: 'position',
              title: 'Посада',
              type: 'string',
            },
            {
              name: 'period',
              title: 'Період Роботи',
              type: 'string',
              description: 'Наприклад: 2015-2020 або 2018-по теперішній час',
            },
          ],
        },
      ],
    }),

    // Нагороди
    defineField({
      name: 'awards',
      title: 'Нагороди',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Назва Нагороди',
              type: 'string',
            },
            {
              name: 'year',
              title: 'Рік',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Опис',
              type: 'text',
              rows: 2,
            },
          ],
        },
      ],
    }),

    // Біографія з rich text
    defineField({
      name: 'biography',
      title: 'Біографія',
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
          title: 'Зображення',
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
              description: 'Посилання на джерело фото',
            },
            {
              name: 'sourceUrl',
              type: 'url',
              title: 'URL Джерела',
            },
          ],
        },
      ],
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
      name: 'assignedEditorRef',
      title: 'Призначений Редактор (Команда)',
      type: 'reference',
      to: [{type: 'teamMember'}],
      options: {
        filter: 'role == "editor" || role == "main_editor"',
      },
      description: 'Оберіть редактора з команди або заповніть текстове поле нижче',
    }),
    defineField({
      name: 'assignedEditorName',
      title: 'Ім\'я Редактора (Текст)',
      type: 'string',
      description: 'Для зовнішніх редакторів або псевдонімів',
      hidden: ({document}) => !!document?.assignedEditorRef,
    }),
    defineField({
      name: 'assignedEditor',
      title: 'Призначений Редактор (Застаріле)',
      type: 'string',
      description: 'Ім\'я або email редактора, який працює над біографією. ЗАСТАРІЛЕ: використовуйте поля вище',
      hidden: true,
    }),
    defineField({
      name: 'assignedChiefEditorRef',
      title: 'Головний Редактор (Команда)',
      type: 'reference',
      to: [{type: 'teamMember'}],
      options: {
        filter: 'role == "main_editor"',
      },
      description: 'Оберіть головного редактора з команди',
    }),
    defineField({
      name: 'assignedChiefEditorName',
      title: 'Ім\'я Головного Редактора (Текст)',
      type: 'string',
      description: 'Для зовнішніх редакторів',
      hidden: ({document}) => !!document?.assignedChiefEditorRef,
    }),
    defineField({
      name: 'assignedChiefEditor',
      title: 'Головний Редактор (Застаріле)',
      type: 'string',
      description: 'Ім\'я або email головного редактора. ЗАСТАРІЛЕ: використовуйте поля вище',
      hidden: true,
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
      title: 'fullName',
      subtitle: 'status',
      media: 'photo',
    },
    prepare({title, subtitle, media}) {
      const statusEmoji = {
        draft: '📝',
        in_review: '👀',
        changes_requested: '🔄',
        approved: '✅',
        published: '🌟',
      }
      return {
        title: title,
        subtitle: `${statusEmoji[subtitle as keyof typeof statusEmoji] || ''} ${subtitle}`,
        media: media,
      }
    },
  },
})
