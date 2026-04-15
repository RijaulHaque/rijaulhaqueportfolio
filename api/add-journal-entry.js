
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password, title, tags, content, media } = req.body;

  // 1. Verify Authentication
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. Configuration check
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub Token not configured' });
  }

  const owner = 'RijaulHaque';
  const repo = 'rijaulhaqueportfolio';
  const path = 'src/data/journal.json';

  try {
    // 3. Get current file data from GitHub to get the 'sha' (required for updates)
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const getRes = await fetch(getUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!getRes.ok) {
      const errorData = await getRes.json();
      return res.status(getRes.status).json({ message: 'Failed to fetch journal from GitHub', error: errorData });
    }

    const { content: encodedContent, sha } = await getRes.json();
    const currentJournal = JSON.parse(Buffer.from(encodedContent, 'base64').toString('utf-8'));

    // 4. Create new entry
    const nextId = currentJournal.length > 0 
      ? Math.max(...currentJournal.map(e => e.id)) + 1 
      : 1;

    const newEntry = {
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      title,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
      content,
      media: media || []
    };

    // 5. Build updated JSON
    const updatedJournal = [...currentJournal, newEntry];
    const updatedContentBase64 = Buffer.from(JSON.stringify(updatedJournal, null, 2)).toString('base64');

    // 6. Commit back to GitHub
    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `feat(journal): add entry "${title}" via Admin Panel`,
        content: updatedContentBase64,
        sha: sha
      })
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      return res.status(putRes.status).json({ message: 'Failed to commit to GitHub', error: errorData });
    }

    return res.status(200).json({ message: 'Journal entry published successfully!', entry: newEntry });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
