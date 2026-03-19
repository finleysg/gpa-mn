export async function revalidateWeb(paths: string[]) {
  const webUrl = process.env.WEB_URL;
  const secret = process.env.REVALIDATION_SECRET;

  if (!webUrl || !secret) {
    console.warn('WEB_URL or REVALIDATION_SECRET not set — skipping web revalidation');
    return;
  }

  try {
    const res = await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths, secret }),
    });

    if (!res.ok) {
      console.error(`Web revalidation failed: ${res.status} ${await res.text()}`);
    }
  } catch (error) {
    console.error('Web revalidation request failed:', error);
  }
}
