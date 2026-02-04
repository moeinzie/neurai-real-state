import PropertyFormClient from '@/components/admin/PropertyFormClient'
import { mockProperties } from '@/lib/mockData'

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { id: 'new' },
    ...mockProperties.map((property) => ({
      id: property.id,
    })),
  ]
}

interface PageProps {
  params: {
    id: string
  }
}

export default function PropertyFormPage({ params }: PageProps) {
  const id = params.id || 'new'

  return <PropertyFormClient id={id} />
}
