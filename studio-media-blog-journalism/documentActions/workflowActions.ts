import {DocumentActionComponent} from 'sanity'

// Action для відправки на розгляд
export const sendToReviewAction: DocumentActionComponent = (props) => {
  const {draft, published, type, id} = props

  // Перевірка чи це документ з workflow
  const workflowTypes = ['biography', 'reflection', 'largeProject']
  if (!workflowTypes.includes(type)) {
    return null
  }

  const doc = draft || published
  const currentStatus = doc?.status

  // Показувати тільки якщо статус draft або changes_requested
  if (currentStatus !== 'draft' && currentStatus !== 'changes_requested') {
    return null
  }

  return {
    label: 'Відправити на Розгляд',
    icon: () => '👀',
    onHandle: async () => {
      const {patch} = props

      // Додаємо запис в історію
      const historyEntry = {
        status: 'in_review',
        changedBy: 'Current User', // В реальному проекті - взяти з контексту користувача
        changedAt: new Date().toISOString(),
        note: 'Відправлено на розгляд головному редактору',
      }

      patch.execute([
        {set: {status: 'in_review'}},
        {
          setIfMissing: {revisionHistory: []},
        },
        {
          insert: {
            after: 'revisionHistory[-1]',
            items: [historyEntry],
          },
        },
      ])

      props.onComplete()
    },
  }
}

// Action для схвалення (тільки для головних редакторів)
export const approveAction: DocumentActionComponent = (props) => {
  const {draft, published, type} = props

  const workflowTypes = ['biography', 'reflection', 'largeProject']
  if (!workflowTypes.includes(type)) {
    return null
  }

  const doc = draft || published
  const currentStatus = doc?.status

  // Показувати тільки якщо статус in_review
  if (currentStatus !== 'in_review') {
    return null
  }

  return {
    label: 'Схвалити',
    icon: () => '✅',
    tone: 'positive',
    onHandle: async () => {
      const {patch} = props

      const historyEntry = {
        status: 'approved',
        changedBy: 'Chief Editor', // В реальному проекті - взяти з контексту
        changedAt: new Date().toISOString(),
        note: 'Схвалено головним редактором',
      }

      patch.execute([
        {set: {status: 'approved'}},
        {
          setIfMissing: {revisionHistory: []},
        },
        {
          insert: {
            after: 'revisionHistory[-1]',
            items: [historyEntry],
          },
        },
      ])

      props.onComplete()
    },
  }
}

// Action для повернення з коментарями
export const requestChangesAction: DocumentActionComponent = (props) => {
  const {draft, published, type} = props

  const workflowTypes = ['biography', 'reflection', 'largeProject']
  if (!workflowTypes.includes(type)) {
    return null
  }

  const doc = draft || published
  const currentStatus = doc?.status

  // Показувати тільки якщо статус in_review
  if (currentStatus !== 'in_review') {
    return null
  }

  return {
    label: 'Повернути на Доопрацювання',
    icon: () => '🔄',
    tone: 'caution',
    onHandle: async () => {
      const {patch} = props

      const historyEntry = {
        status: 'changes_requested',
        changedBy: 'Chief Editor',
        changedAt: new Date().toISOString(),
        note: 'Повернуто на доопрацювання. Перегляньте коментарі',
      }

      patch.execute([
        {set: {status: 'changes_requested'}},
        {
          setIfMissing: {revisionHistory: []},
        },
        {
          insert: {
            after: 'revisionHistory[-1]',
            items: [historyEntry],
          },
        },
      ])

      props.onComplete()
    },
  }
}

// Action для публікації
export const publishWorkflowAction: DocumentActionComponent = (props) => {
  const {draft, published, type} = props

  const workflowTypes = ['biography', 'reflection', 'largeProject']
  if (!workflowTypes.includes(type)) {
    return null
  }

  const doc = draft || published
  const currentStatus = doc?.status

  // Показувати тільки якщо статус approved
  if (currentStatus !== 'approved') {
    return null
  }

  return {
    label: 'Опублікувати',
    icon: () => '🌟',
    tone: 'positive',
    onHandle: async () => {
      const {patch} = props

      const historyEntry = {
        status: 'published',
        changedBy: 'System',
        changedAt: new Date().toISOString(),
        note: 'Опубліковано',
      }

      patch.execute([
        {set: {status: 'published'}},
        {
          setIfMissing: {revisionHistory: []},
        },
        {
          insert: {
            after: 'revisionHistory[-1]',
            items: [historyEntry],
          },
        },
      ])

      props.onComplete()
    },
  }
}
