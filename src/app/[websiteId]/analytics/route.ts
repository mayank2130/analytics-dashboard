import { NextRequest, NextResponse } from 'next/server'
import { trackAnalytics } from '@/actions/analytics'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const result = await trackAnalytics(formData)

  if (result.success) {
    return NextResponse.json({ message: 'Analytics tracked successfully' }, { status: 200 })
  } else {
    return NextResponse.json({ message: 'Failed to track analytics' }, { status: 500 })
  }
}