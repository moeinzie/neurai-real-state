import PropertyDetail from '@/components/property/PropertyDetail'
import { mockProperties } from '@/lib/mockData'

// Generate static params for static export
export async function generateStaticParams() {
  return mockProperties.map((property) => ({
    id: property.id,
  }))
}

interface PageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PageProps) {
  const id = params.id || ''

  return <PropertyDetail propertyId={id} />
}

