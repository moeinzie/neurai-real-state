export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Madrid Real Estate Investment Opportunities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Machine-learning enhanced arbitrage analysis to identify mispriced properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/explore"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Explore Properties
            </a>
            <a
              href="/analytics"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition border border-primary-500"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

