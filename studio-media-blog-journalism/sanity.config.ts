import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {
  sendToReviewAction,
  approveAction,
  requestChangesAction,
  publishWorkflowAction,
} from './documentActions/workflowActions'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'media-blog-journalism',

  projectId: 'irtwns5j',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Додаємо custom actions для документів з workflow
      const workflowTypes = ['biography', 'reflection', 'largeProject']
      if (workflowTypes.includes(context.schemaType)) {
        return [
          ...prev,
          sendToReviewAction,
          approveAction,
          requestChangesAction,
          publishWorkflowAction,
        ]
      }
      return prev
    },
  },
})
