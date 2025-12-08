'use client'

import {useState} from 'react'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {Separator} from '@/components/ui/separator'
import {TeamMemberDialog} from '@/components/TeamMemberDialog'
import {client} from '@/sanity/client'
import {TEAM_MEMBER_RELATED_CONTENT_QUERY} from '@/sanity/queries'

interface SocialLink {
  platform: string
  url: string
}

interface TeamMember {
  _id: string
  fullName: string
  role?: string
  photo?: SanityImageSource
  email?: string
  phone?: string
  bio?: string
  socialLinks?: SocialLink[]
}

interface TeamSectionProps {
  teamMembers: TeamMember[]
}

const ROLE_ORDER: Record<string, number> = {
  main_editor: 0,
  journalist: 1,
  photographer: 2,
  editor: 3,
  designer: 4,
}

const ROLE_LABELS: Record<string, string> = {
  main_editor: 'Головний редактор',
  journalist: 'Журналісти',
  photographer: 'Фотографи',
  editor: 'Редактори',
  designer: 'Дизайнери',
}

const ROLE_LABELS_SINGULAR: Record<string, string> = {
  main_editor: 'Головний редактор',
  journalist: 'Журналіст',
  photographer: 'Фотограф',
  editor: 'Редактор',
  designer: 'Дизайнер',
}

export function TeamSection({teamMembers}: TeamSectionProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [relatedContent, setRelatedContent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  // Sort team members by role priority, then alphabetically
  const sortedMembers = [...teamMembers].sort((a, b) => {
    const roleA = ROLE_ORDER[a.role || ''] ?? 999
    const roleB = ROLE_ORDER[b.role || ''] ?? 999

    if (roleA !== roleB) {
      return roleA - roleB
    }

    return a.fullName.localeCompare(b.fullName, 'uk')
  })

  // Group by role
  const groupedMembers = sortedMembers.reduce(
    (acc, member) => {
      const role = member.role || 'other'
      if (!acc[role]) {
        acc[role] = []
      }
      acc[role].push(member)
      return acc
    },
    {} as Record<string, TeamMember[]>,
  )

  const handleMemberClick = async (member: TeamMember) => {
    setSelectedMember(member)
    setIsDialogOpen(true)
    setIsLoadingContent(true)

    // Fetch related content
    try {
      const content = await client.fetch(TEAM_MEMBER_RELATED_CONTENT_QUERY, {
        teamMemberId: member._id,
        teamMemberName: member.fullName,
      })
      setRelatedContent(content)
    } catch (error) {
      console.error('Error fetching related content:', error)
      setRelatedContent(null)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedMember(null)
      setRelatedContent(null)
      setIsLoadingContent(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
      <h3 className="text-xl font-semibold">Команда</h3>
      <p className="mt-2 text-sm text-white/70">
        Студенти, викладачі та редактори, які щодня працюють над новим
        контентом.
      </p>
      <Separator className="my-6 bg-white/20" />

      <div className="space-y-6">
        {Object.entries(groupedMembers).map(([role, members]) => (
          <div key={role}>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
              {ROLE_LABELS[role] || 'Інші'}
            </h4>
            <div className="space-y-3">
              {members.map((member) => (
                <button
                  key={member._id}
                  onClick={() => handleMemberClick(member)}
                  aria-label={`Відкрити профіль ${member.fullName}, ${ROLE_LABELS_SINGULAR[member.role || ''] || member.role || 'Член команди'}`}
                  className="flex w-full items-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-sm font-semibold text-white">
                    {member.fullName
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {member.fullName}
                    </p>
                    {member.role && (
                      <p className="text-xs text-white/60">
                        {ROLE_LABELS_SINGULAR[member.role] || member.role}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {teamMembers.length === 0 && (
          <p className="text-sm text-white/70">
            Дані про команду з'являться після публікації учасників у Sanity
            Studio.
          </p>
        )}
      </div>

      {selectedMember && (
        <TeamMemberDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          member={selectedMember}
          relatedContent={relatedContent}
          isLoadingContent={isLoadingContent}
        />
      )}
    </div>
  )
}
