import { trackPageView, getLiveAnalyticsSummary } from '../lib/analytics'
import { getApproximateLocation, getCountryFlag, formatLocationLabel, isLocalOrPrivateIp } from '../lib/geo'
import { redis } from '../lib/redis'

async function runTests() {
  console.log('--- STARTING PORTFOLIO ANALYTICS & GEOLOCATION TESTS ---')

  // Test 1: Geo Flag & Formatting Helpers
  console.log('\n[Test 1] Testing Location Helpers...')
  const inFlag = getCountryFlag('IN')
  const usFlag = getCountryFlag('US')
  const gbFlag = getCountryFlag('GB')
  const unknownFlag = getCountryFlag('UNKNOWN')
  console.log(`- IN Flag: ${inFlag} (Expected: 🇮🇳)`)
  console.log(`- US Flag: ${usFlag} (Expected: 🇺🇸)`)
  console.log(`- GB Flag: ${gbFlag} (Expected: 🇬🇧)`)
  console.log(`- Unknown Flag: ${unknownFlag} (Expected: 🌐)`)

  const locLabel1 = formatLocationLabel({ city: 'Chennai', region: 'Tamil Nadu', country: 'India' })
  const locLabel2 = formatLocationLabel({ country: 'India' })
  const locLabel3 = formatLocationLabel(null)
  console.log(`- Full Location: "${locLabel1}"`)
  console.log(`- Country-only Location: "${locLabel2}"`)
  console.log(`- Null Location: "${locLabel3}"`)

  // Test 2: Local & Private IP Detection
  console.log('\n[Test 2] Testing IP Check...')
  console.log(`- 127.0.0.1 isLocal: ${isLocalOrPrivateIp('127.0.0.1')} (Expected: true)`)
  console.log(`- 192.168.1.1 isLocal: ${isLocalOrPrivateIp('192.168.1.1')} (Expected: true)`)
  console.log(`- 8.8.8.8 isLocal: ${isLocalOrPrivateIp('8.8.8.8')} (Expected: false)`)

  // Test 3: Geolocation Resolution
  console.log('\n[Test 3] Testing Geolocation Resolution...')
  const localGeo = await getApproximateLocation('127.0.0.1')
  console.log(`- Localhost Geo:`, localGeo)

  const publicGeo = await getApproximateLocation('1.1.1.1')
  console.log(`- Public IP (1.1.1.1) Geo:`, publicGeo)

  // Test 4: Redis Connection
  console.log('\n[Test 4] Testing Redis Connection...')
  if (redis) {
    const raw = await redis.get('portfolio:views')
    console.log(`- Connected to Upstash Redis! Current 'portfolio:views':`, raw)
  } else {
    console.log('- Redis is not connected.')
  }

  // Test 5: Track View Flow with Random Simulated IP
  console.log('\n[Test 5] Testing Page View Tracking Flow...')
  const simulatedIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`
  console.log(`- Simulating first visit from IP: ${simulatedIp}`)

  const trackRes1 = await trackPageView({
    path: '/',
    ip: simulatedIp,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    country: 'United States',
    city: 'Mountain View',
  })
  console.log(`- First Visit Result: isUnique=${trackRes1.isUnique} (Expected: true), totalViews=${trackRes1.totalViews}`)

  // Test 6: Duplicate Refresh Check
  console.log('\n[Test 6] Testing 24h Duplicate Deduplication...')
  const trackRes2 = await trackPageView({
    path: '/',
    ip: simulatedIp,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    country: 'United States',
    city: 'Mountain View',
  })
  console.log(`- Duplicate Visit Result: isUnique=${trackRes2.isUnique} (Expected: false), totalViews=${trackRes2.totalViews}`)

  // Test 7: Fetch Analytics Summary
  console.log('\n[Test 7] Testing Analytics Summary Retrieval...')
  const summary = await getLiveAnalyticsSummary()
  console.log(`- Total Views (from Redis): ${summary.totalViews}`)
  console.log(`- Unique Visitors (from Redis): ${summary.uniqueVisitors}`)
  console.log(`- Redis Connected: ${summary.redisConnected}`)
  console.log(`- Recent Visitors Count: ${summary.recentVisitors.length}`)
  if (summary.recentVisitors.length > 0) {
    console.log(`- Latest Visitor:`, summary.recentVisitors[0])
  }
  console.log(`- Top Countries:`, summary.topCountries)
  console.log(`- Top Cities:`, summary.topCities)

  console.log('\n--- ALL TESTS COMPLETED SUCCESSFULLY ---')
}

runTests().catch((err) => {
  console.error('Test execution error:', err)
  process.exit(1)
})
