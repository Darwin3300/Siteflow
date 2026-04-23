import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function classifyCategory(text: string): 'GENERAL' | 'ELECTRICAL' | 'FLOORING' | 'PAINTING' {
  const lowerText = text.toLowerCase()
  const keywords = {
    ELECTRICAL: ['wire', 'panel', 'breaker', 'voltage'],
    FLOORING: ['tile', 'grout', 'plank', 'wood'],
    PAINTING: ['primer', 'coat', 'roller'],
  }

  const scores = {
    ELECTRICAL: 0,
    FLOORING: 0,
    PAINTING: 0,
  }

  for (const category of Object.keys(keywords) as Array<keyof typeof keywords>) {
    for (const keyword of keywords[category]) {
      if (lowerText.includes(keyword)) {
        scores[category] += 1
      }
    }
  }

  const bestCategory = Object.entries(scores).reduce((best, [category, score]) => {
    if (score > best.score) {
      return { category, score }
    }
    return best
  }, { category: 'GENERAL', score: 0 })

  return bestCategory.score > 0 ? (bestCategory.category as 'ELECTRICAL' | 'FLOORING' | 'PAINTING') : 'GENERAL'
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { text, imageUrl } = await request.json()

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 })
  }

  const category = classifyCategory(text)

  const log = await prisma.siteLog.create({
    data: {
      text,
      category,
      imageUrl,
      userId: session.user!.id,
    }
  })

  return NextResponse.json(log)
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs = await prisma.siteLog.findMany({
    where: {
      userId: session.user!.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(logs)
}