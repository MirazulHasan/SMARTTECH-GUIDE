import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if category has posts
    const postCount = await prisma.post.count({
      where: { categoryId: id }
    });

    if (postCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with active posts. Reassign or delete posts first." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, icon } = await req.json();
    const slug = name?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    const category = await prisma.category.update({
      where: { id },
      data: { 
        ...(name && { name, slug }),
        ...(icon && { icon })
      },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
