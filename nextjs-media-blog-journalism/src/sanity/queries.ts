// GROQ Queries для всіх типів контенту

// ==================== БІОГРАФІЇ ====================

// Отримати всі опубліковані біографії
export const BIOGRAPHIES_QUERY = `*[_type == "biography" && status == "published"] | order(fullName asc) {
  _id,
  _type,
  fullName,
  slug,
  photo,
  birthDate,
  birthPlace,
  deathDate,
  deathPlace,
  "excerpt": array::join(string::split((pt::text(biography)), "")[0..150], "") + "..."
}`

// Отримати одну біографію за slug
export const BIOGRAPHY_QUERY = `*[_type == "biography" && slug.current == $slug && status == "published"][0] {
  _id,
  _type,
  fullName,
  slug,
  photo,
  birthDate,
  birthPlace,
  deathDate,
  deathPlace,
  education,
  workplaces,
  awards,
  biography,
  status,
  "relatedReflections": *[_type == "reflection" && references(^._id) && status == "published"] {
    _id,
    title,
    slug,
    studentName
  }
}`

// Отримати всі біографії для генерації статичних сторінок
export const BIOGRAPHY_SLUGS_QUERY = `*[_type == "biography" && defined(slug.current) && status == "published"] {
  "slug": slug.current
}`

// ==================== РЕФЛЕКСІЇ ====================

// Отримати всі опубліковані рефлексії
export const REFLECTIONS_QUERY = `*[_type == "reflection" && status == "published"] | order(submittedAt desc) {
  _id,
  _type,
  title,
  slug,
  studentName,
  submittedAt,
  relatedBiography->{
    fullName,
    slug,
    photo
  },
  "excerpt": array::join(string::split((pt::text(essay)), "")[0..150], "") + "..."
}`

// Отримати одну рефлексію за slug
export const REFLECTION_QUERY = `*[_type == "reflection" && slug.current == $slug && status == "published"][0] {
  _id,
  _type,
  title,
  slug,
  studentName,
  studentEmail,
  essay,
  submittedAt,
  grade,
  relatedBiography->{
    _id,
    fullName,
    slug,
    photo,
    birthDate,
    deathDate
  }
}`

// Отримати всі рефлексії для генерації статичних сторінок
export const REFLECTION_SLUGS_QUERY = `*[_type == "reflection" && defined(slug.current) && status == "published"] {
  "slug": slug.current
}`

// Отримати рефлексії для конкретної біографії
export const REFLECTIONS_BY_BIOGRAPHY_QUERY = `*[_type == "reflection" && references($biographyId) && status == "published"] | order(submittedAt desc) {
  _id,
  title,
  slug,
  studentName,
  submittedAt,
  "excerpt": array::join(string::split((pt::text(essay)), "")[0..100], "") + "..."
}`

// ==================== ВЕЛИКІ ПРОЕКТИ ====================

// Отримати всі опубліковані проекти
export const LARGE_PROJECTS_QUERY = `*[_type == "largeProject" && status == "published"] | order(completedAt desc) {
  _id,
  _type,
  title,
  slug,
  description,
  coverImage,
  collaborators,
  startedAt,
  completedAt,
  status
}`

// Отримати один проект за slug
export const LARGE_PROJECT_QUERY = `*[_type == "largeProject" && slug.current == $slug && status == "published"][0] {
  _id,
  _type,
  title,
  slug,
  description,
  coverImage,
  collaborators,
  content,
  startedAt,
  completedAt,
  status
}`

// Отримати всі проекти для генерації статичних сторінок
export const LARGE_PROJECT_SLUGS_QUERY = `*[_type == "largeProject" && defined(slug.current) && status == "published"] {
  "slug": slug.current
}`

// ==================== ЧЛЕНИ КОМАНДИ ====================

// Отримати всіх членів команди
export const TEAM_MEMBERS_QUERY = `*[_type == "teamMember"] | order(fullName asc) {
  _id,
  fullName,
  photo,
  role,
  email,
  phone,
  bio,
  socialLinks
}`

// ==================== СТАТИСТИКА ====================

// Отримати статистику по всіх типах
export const STATS_QUERY = `{
  "totalBiographies": count(*[_type == "biography"]),
  "publishedBiographies": count(*[_type == "biography" && status == "published"]),
  "totalReflections": count(*[_type == "reflection"]),
  "publishedReflections": count(*[_type == "reflection" && status == "published"]),
  "totalProjects": count(*[_type == "largeProject"]),
  "publishedProjects": count(*[_type == "largeProject" && status == "published"]),
  "teamMembers": count(*[_type == "teamMember"])
}`

// ==================== ПОШУК ====================

// Універсальний пошук по всіх типах
export const SEARCH_QUERY = `*[
  _type in ["biography", "reflection", "largeProject"] &&
  [title, fullName, studentName] match $searchTerm &&
  status == "published"
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, fullName),
  slug,
  "subtitle": select(
    _type == "biography" => "Біографія журналіста",
    _type == "reflection" => "Рефлексія: " + studentName,
    _type == "largeProject" => "Великий проект"
  )
}`

// ==================== HOMEPAGE ====================

// Отримати featured контент для головної сторінки
export const HOMEPAGE_QUERY = `{
  "featuredBiographies": *[_type == "biography" && status == "published"] | order(_createdAt desc)[0...3] {
    _id,
    fullName,
    slug,
    photo,
    birthDate,
    deathDate,
    "excerpt": array::join(string::split((pt::text(biography)), "")[0..100], "") + "..."
  },
  "recentReflections": *[_type == "reflection" && status == "published"] | order(submittedAt desc)[0...3] {
    _id,
    title,
    slug,
    studentName,
    relatedBiography->{fullName, slug, photo}
  },
  "featuredProjects": *[_type == "largeProject" && status == "published"] | order(completedAt desc)[0...2] {
    _id,
    title,
    slug,
    description,
    coverImage,
    collaborators
  }
}`

// ==================== ADMIN / WORKFLOW ====================

// Для адмін панелі - отримати документи по статусу
export const DOCUMENTS_BY_STATUS_QUERY = `*[
  _type in ["biography", "reflection", "largeProject"] &&
  status == $status
] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, fullName),
  slug,
  status,
  _updatedAt,
  assignedEditor,
  assignedChiefEditor
}`
