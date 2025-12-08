'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
import {urlForImage} from '@/lib/sanityImage'

interface SocialLink {
  platform: string
  url: string
}

interface RelatedContent {
  biographies?: Array<{
    _id: string
    fullName: string
    slug: {current: string}
    photo?: SanityImageSource
  }>
  reflections?: Array<{
    _id: string
    title: string
    slug: {current: string}
    relatedBiography?: {
      fullName: string
      slug: {current: string}
    }
  }>
  projects?: Array<{
    _id: string
    title: string
    slug: {current: string}
    coverImage?: SanityImageSource
  }>
}

interface TeamMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: {
    _id: string
    fullName: string
    role?: string
    photo?: SanityImageSource
    email?: string
    phone?: string
    bio?: string
    socialLinks?: SocialLink[]
  }
  relatedContent?: RelatedContent | null
  isLoadingContent?: boolean
}

const ROLE_LABELS: Record<string, string> = {
  main_editor: 'Головний редактор',
  journalist: 'Журналіст',
  photographer: 'Фотограф',
  editor: 'Редактор',
  designer: 'Дизайнер',
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: '📘',
  twitter: '🐦',
  linkedin: '💼',
  instagram: '📷',
  other: '🔗',
}

export function TeamMemberDialog({
  open,
  onOpenChange,
  member,
  relatedContent,
  isLoadingContent,
}: TeamMemberDialogProps) {
  const photoUrl = member.photo
    ? urlForImage(member.photo)?.width(400).height(400).fit('crop').url()
    : null

  const roleLabel = member.role
    ? ROLE_LABELS[member.role] || member.role
    : 'Член команди'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-50">
        <DialogHeader>
          <div className="flex items-start gap-6">
            {photoUrl ? (
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <Image
                  src={photoUrl}
                  alt={member.fullName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-white bg-blue-500/30 text-2xl font-semibold text-white shadow-lg">
                {member.fullName
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            )}
            <div className="flex-1">
              <DialogTitle>{member.fullName}</DialogTitle>
              <DialogDescription>
                <Badge className="mt-2">{roleLabel}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Biography */}
          {member.bio && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Біографія
              </h3>
              <Separator className="my-3 bg-slate-200" />
              <p className="text-sm leading-relaxed text-slate-700">
                {member.bio}
              </p>
            </div>
          )}

          {/* Contact Info */}
          {(member.email || member.phone) && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Контакти
              </h3>
              <Separator className="my-3 bg-slate-200" />
              <div className="space-y-2 text-sm">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Email:</span>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Телефон:</span>
                    <a
                      href={`tel:${member.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {member.socialLinks && member.socialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Соціальні мережі
              </h3>
              <Separator className="my-3 bg-slate-200" />
              <div className="flex flex-wrap gap-2">
                {member.socialLinks.map((link, index) => (
                  <Button key={index} asChild variant="outline" size="sm">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {SOCIAL_ICONS[link.platform] || '🔗'}{' '}
                      {link.platform.charAt(0).toUpperCase() +
                        link.platform.slice(1)}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Related Content */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Пов'язаний контент
            </h3>
            <Separator className="my-3 bg-slate-200" />

            {isLoadingContent ? (
              <p className="text-sm text-slate-500">Завантаження...</p>
            ) : relatedContent ? (
              <div className="space-y-4">
                {/* Biographies */}
                {relatedContent.biographies &&
                  relatedContent.biographies.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-blue-600">
                        Біографії ({relatedContent.biographies.length})
                      </h4>
                      <ul className="space-y-1">
                        {relatedContent.biographies.map((bio) => (
                          <li key={bio._id}>
                            <Link
                              href={`/biographies/${bio.slug.current}`}
                              className="text-sm text-slate-700 hover:text-blue-600 hover:underline"
                              onClick={() => onOpenChange(false)}
                            >
                              {bio.fullName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Reflections */}
                {relatedContent.reflections &&
                  relatedContent.reflections.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-blue-600">
                        Рефлексії ({relatedContent.reflections.length})
                      </h4>
                      <ul className="space-y-1">
                        {relatedContent.reflections.map((refl) => (
                          <li key={refl._id}>
                            <Link
                              href={`/reflections/${refl.slug.current}`}
                              className="text-sm text-slate-700 hover:text-blue-600 hover:underline"
                              onClick={() => onOpenChange(false)}
                            >
                              {refl.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Projects */}
                {relatedContent.projects &&
                  relatedContent.projects.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-blue-600">
                        Проєкти ({relatedContent.projects.length})
                      </h4>
                      <ul className="space-y-1">
                        {relatedContent.projects.map((proj) => (
                          <li key={proj._id}>
                            <Link
                              href={`/projects/${proj.slug.current}`}
                              className="text-sm text-slate-700 hover:text-blue-600 hover:underline"
                              onClick={() => onOpenChange(false)}
                            >
                              {proj.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Empty state */}
                {!relatedContent.biographies?.length &&
                  !relatedContent.reflections?.length &&
                  !relatedContent.projects?.length && (
                    <p className="text-sm text-slate-500">
                      Поки що немає пов'язаного контенту
                    </p>
                  )}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
