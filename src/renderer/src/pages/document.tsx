import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Document as DocumentDTO } from '@shared/types/ipc'
import { Editor, OnContentUpdateParams } from '../components/Editor'
import { ToC } from '../components/ToC'

export function Document() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery(['document', id], async () => {
    const response = await window.api.fetchDocument({ id: id! })

    return response.data
  })

  const initialContent = useMemo(() => {
    if (data) {
      return `<h1>${data.title}</h1>${data.content || '<p></p>'}`
    }

    return ''
  }, [data])

  const { mutateAsync: saveDocument } = useMutation(
    async (params: OnContentUpdateParams) => {
      await window.api.saveDocument({
        id: data!.id,
        title: params.title,
        content: params.content,
      })
    },
    {
      onSuccess: (_, { title, content }) => {
        queryClient.setQueryData<Array<DocumentDTO>>(
          ['documents'],
          (documents) => {
            return documents?.map((document) => {
              if (document.id === id) return { ...document, title }

              return document
            })
          },
        )
      },
    },
  )

  function handleEditorContentUpdate({
    title,
    content,
  }: OnContentUpdateParams) {
    saveDocument({ title, content })
  }

  return (
    <main className="flex-1 flex py-12 px-10 gap-8">
      <aside className="hidden lg:block sticky top-0">
        <span className="text-rotion-300 font-semi-bold text-xs">
          TABLE OF CONTENTS
        </span>

        <ToC.Root>
          <ToC.Link>Backend</ToC.Link>
          <ToC.Section>
            <ToC.Link>Node.js</ToC.Link>
            <ToC.Section>
              <ToC.Link>Express</ToC.Link>
              <ToC.Link>Sequelize</ToC.Link>
            </ToC.Section>
          </ToC.Section>
        </ToC.Root>
      </aside>

      <section className="flex-1 flex flex-col items-center">
        {!isFetching && data && (
          <Editor
            content={initialContent}
            onContentUpdate={handleEditorContentUpdate}
          />
        )}
        {isFetching && <div>Loading...</div>}
        {isFetching && !data && <div>Document not found</div>}
      </section>
    </main>
  )
}
