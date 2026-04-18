import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET single post
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// PUT update post
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, coverImage, categoryId, published, featured } = body;

    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        categoryId,
        published,
        featured,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
