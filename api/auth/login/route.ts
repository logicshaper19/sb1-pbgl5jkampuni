// Make sure your API route is properly set up
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    // Add proper error handling and logging here
    // Return appropriate status codes
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
    })
  }
} 