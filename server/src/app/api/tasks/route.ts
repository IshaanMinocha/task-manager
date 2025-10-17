import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    return NextResponse.json({ message: 'Get tasks endpoint' });
}

export async function POST(request: Request) {
    return NextResponse.json({ message: 'Create task endpoint' });
}

