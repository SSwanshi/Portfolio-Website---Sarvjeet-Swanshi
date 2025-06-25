import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    // Path to the image in the public directory
    const imagePath = path.join(process.cwd(), 'public', 'self.jpg');
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': process.env.NODE_ENV === 'development' 
          ? 'no-cache, no-store, must-revalidate' 
          : 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}