import type { NextApiRequest, NextApiResponse } from 'next'

interface IQuery {
  secret: string
  urls: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { secret, urls: urlsString } = req.query as unknown as IQuery
  const urls = JSON.parse(urlsString)

  // Check for secret to confirm this is a valid request
  if (secret !== process.env.ENV_REVALIDATE_CACHE_KEY) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  if (!urls.length) {
    return res.status(400).json({ message: 'Missing URL' })
  }

  try {
    // Revalidate each URL
    for (const url of urls) {
      await res.revalidate(url)
    }
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Failed to revalidate cache')
  }
}
