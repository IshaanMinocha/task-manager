import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    return NextResponse.json({ message: 'Update task endpoint' });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    return NextResponse.json({ message: 'Delete task endpoint' });
}

