// Edge function for Next.js API routes
export default async (request, context) => {
  // Log some information for debugging
  console.log('Next.js edge function handling API request');
  console.log('URL:', request.url);
  console.log('Method:', request.method);
  
  // Forward the request to the Next.js API handler
  return context.next();
}; 