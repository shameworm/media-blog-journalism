import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Типи Sanity webhook payload
type WebhookPayload = {
  _id: string
  _type: string
  slug?: {
    current: string
  }
}

export async function POST(req: NextRequest) {
  try {
    // Перевірка секретного ключа
    const secret = req.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET

    if (!expectedSecret) {
      console.error('SANITY_REVALIDATE_SECRET не налаштовано')
      return NextResponse.json(
        { message: 'Webhook secret не налаштовано' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      console.error('Невірний webhook secret')
      return NextResponse.json(
        { message: 'Невірний secret' },
        { status: 401 }
      )
    }

    // Парсинг тіла запиту від Sanity
    const body = await req.json()
    const payload = body as WebhookPayload

    console.log('📥 Отримано webhook від Sanity:', {
      type: payload._type,
      id: payload._id,
      slug: payload.slug?.current,
    })

    // Масив шляхів для revalidation
    const pathsToRevalidate: string[] = []

    // Визначаємо які сторінки потрібно оновити в залежності від типу контенту
    switch (payload._type) {
      case 'biography':
        pathsToRevalidate.push('/')
        pathsToRevalidate.push('/biographies')
        if (payload.slug?.current) {
          pathsToRevalidate.push(`/biographies/${payload.slug.current}`)
        }
        break

      case 'reflection':
        pathsToRevalidate.push('/')
        pathsToRevalidate.push('/reflections')
        if (payload.slug?.current) {
          pathsToRevalidate.push(`/reflections/${payload.slug.current}`)
        }
        break

      case 'largeProject':
        pathsToRevalidate.push('/')
        pathsToRevalidate.push('/projects')
        if (payload.slug?.current) {
          pathsToRevalidate.push(`/projects/${payload.slug.current}`)
        }
        break

      case 'teamMember':
        pathsToRevalidate.push('/about')
        break

      default:
        console.warn(`⚠️  Невідомий тип документа: ${payload._type}`)
        // Все одно оновлюємо головну сторінку на всяк випадок
        pathsToRevalidate.push('/')
    }

    // Виконуємо revalidation для всіх потрібних шляхів
    for (const path of pathsToRevalidate) {
      revalidatePath(path)
      console.log(`✅ Revalidated: ${path}`)
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      message: `Успішно оновлено ${pathsToRevalidate.length} сторінок`,
    })
  } catch (err) {
    console.error('❌ Помилка webhook revalidation:', err)
    return NextResponse.json(
      {
        message: 'Помилка при обробці webhook',
        error: err instanceof Error ? err.message : 'Невідома помилка'
      },
      { status: 500 }
    )
  }
}
