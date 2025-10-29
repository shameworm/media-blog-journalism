import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Контент')
    .items([
      // Дашборд з документами на розгляді
      S.listItem()
        .title('📋 На Розгляді')
        .child(
          S.list()
            .title('Документи на Розгляді')
            .items([
              S.listItem()
                .title('Біографії')
                .child(
                  S.documentList()
                    .title('Біографії на розгляді')
                    .filter('_type == "biography" && status == "in_review"')
                ),
              S.listItem()
                .title('Рефлексії')
                .child(
                  S.documentList()
                    .title('Рефлексії на розгляді')
                    .filter('_type == "reflection" && status == "in_review"')
                ),
              S.listItem()
                .title('Великі Проекти')
                .child(
                  S.documentList()
                    .title('Проекти на розгляді')
                    .filter('_type == "largeProject" && status == "in_review"')
                ),
            ])
        ),

      S.divider(),

      // Біографії
      S.listItem()
        .title('👤 Біографії Журналістів')
        .child(
          S.list()
            .title('Біографії за статусом')
            .items([
              S.listItem()
                .title('📝 Чернетки')
                .child(
                  S.documentList()
                    .title('Біографії - Чернетки')
                    .filter('_type == "biography" && status == "draft"')
                ),
              S.listItem()
                .title('👀 На Розгляді')
                .child(
                  S.documentList()
                    .title('Біографії - На Розгляді')
                    .filter('_type == "biography" && status == "in_review"')
                ),
              S.listItem()
                .title('🔄 Потребує Змін')
                .child(
                  S.documentList()
                    .title('Біографії - Потребує Змін')
                    .filter('_type == "biography" && status == "changes_requested"')
                ),
              S.listItem()
                .title('✅ Схвалені')
                .child(
                  S.documentList()
                    .title('Біографії - Схвалені')
                    .filter('_type == "biography" && status == "approved"')
                ),
              S.listItem()
                .title('🌟 Опубліковані')
                .child(
                  S.documentList()
                    .title('Біографії - Опубліковані')
                    .filter('_type == "biography" && status == "published"')
                ),
              S.divider(),
              S.listItem()
                .title('Всі Біографії')
                .child(S.documentTypeList('biography').title('Всі Біографії')),
            ])
        ),

      // Рефлексії
      S.listItem()
        .title('📖 Рефлексії (Есе)')
        .child(
          S.list()
            .title('Рефлексії за статусом')
            .items([
              S.listItem()
                .title('📝 Чернетки')
                .child(
                  S.documentList()
                    .title('Рефлексії - Чернетки')
                    .filter('_type == "reflection" && status == "draft"')
                ),
              S.listItem()
                .title('👀 На Розгляді')
                .child(
                  S.documentList()
                    .title('Рефлексії - На Розгляді')
                    .filter('_type == "reflection" && status == "in_review"')
                ),
              S.listItem()
                .title('🔄 Потребує Змін')
                .child(
                  S.documentList()
                    .title('Рефлексії - Потребує Змін')
                    .filter('_type == "reflection" && status == "changes_requested"')
                ),
              S.listItem()
                .title('✅ Схвалені')
                .child(
                  S.documentList()
                    .title('Рефлексії - Схвалені')
                    .filter('_type == "reflection" && status == "approved"')
                ),
              S.listItem()
                .title('🌟 Опубліковані')
                .child(
                  S.documentList()
                    .title('Рефлексії - Опубліковані')
                    .filter('_type == "reflection" && status == "published"')
                ),
              S.divider(),
              S.listItem()
                .title('Всі Рефлексії')
                .child(S.documentTypeList('reflection').title('Всі Рефлексії')),
            ])
        ),

      // Великі Проекти
      S.listItem()
        .title('🚀 Великі Проекти')
        .child(
          S.list()
            .title('Проекти за статусом')
            .items([
              S.listItem()
                .title('📝 Чернетки')
                .child(
                  S.documentList()
                    .title('Проекти - Чернетки')
                    .filter('_type == "largeProject" && status == "draft"')
                ),
              S.listItem()
                .title('⚙️ В Роботі')
                .child(
                  S.documentList()
                    .title('Проекти - В Роботі')
                    .filter('_type == "largeProject" && status == "in_progress"')
                ),
              S.listItem()
                .title('👀 На Розгляді')
                .child(
                  S.documentList()
                    .title('Проекти - На Розгляді')
                    .filter('_type == "largeProject" && status == "in_review"')
                ),
              S.listItem()
                .title('🔄 Потребує Змін')
                .child(
                  S.documentList()
                    .title('Проекти - Потребує Змін')
                    .filter('_type == "largeProject" && status == "changes_requested"')
                ),
              S.listItem()
                .title('✅ Схвалені')
                .child(
                  S.documentList()
                    .title('Проекти - Схвалені')
                    .filter('_type == "largeProject" && status == "approved"')
                ),
              S.listItem()
                .title('🌟 Опубліковані')
                .child(
                  S.documentList()
                    .title('Проекти - Опубліковані')
                    .filter('_type == "largeProject" && status == "published"')
                ),
              S.divider(),
              S.listItem()
                .title('Всі Проекти')
                .child(S.documentTypeList('largeProject').title('Всі Проекти')),
            ])
        ),

      S.divider(),

      // Члени Команди
      S.listItem()
        .title('👥 Члени Команди')
        .child(S.documentTypeList('teamMember').title('Члени Команди')),

      // Пости (оригінальний тип)
      S.listItem().title('📝 Пости').child(S.documentTypeList('post').title('Пости')),
    ])

export default structure
