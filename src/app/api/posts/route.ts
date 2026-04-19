import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all posts (Admin view)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, author: { select: { name: true } } },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST create new post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, content, excerpt, coverImage, categoryId, published, featured } = body;

    // Generate a random stable slug (numerical IDs work better with HTML titles)
    const slug = `post-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in DB. Please sign out and sign in again." }, { status: 401 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage: coverImage || null,
        categoryId: categoryId === "" ? undefined : categoryId,
        published,
        featured,
        authorId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}
