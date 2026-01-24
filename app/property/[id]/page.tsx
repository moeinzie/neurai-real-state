import PropertyDetail from '@/components/property/PropertyDetail'

export default function PropertyPage({ params }: { params: { id: string } }) {
  return <PropertyDetail propertyId={params.id} />
}

