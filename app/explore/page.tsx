import dynamicImport from 'next/dynamic'

// Dynamic import to prevent SSR issues with react-leaflet
// Using ssr: false is sufficient for static export
const ExploreView = dynamicImport(() => import('@/components/explore/ExploreView'), {
  ssr: false,
})

export default function ExplorePage() {
  return <ExploreView />
}

