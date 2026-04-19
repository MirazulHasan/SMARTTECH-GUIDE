import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { 
      heroTitle, heroSubtitle, tickerItems, footerText, logoUrl, 
      siteName, siteTitle, exploreTitle, exploreSubtitle,
      stayUpdatedTitle, stayUpdatedSubtitle, footerTitle, footerSubtitle,
      socialLinkFacebook, socialLinks, heroStatusText, heroButton1Text, heroButton1Link,
      heroButton2Text, heroButton2Link,
      splashTopLeft, splashTopRight, splashBottomLeft, splashBottomRight, splashLogs
    } = body;
    
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: { 
        heroTitle, heroSubtitle, tickerItems, footerText, logoUrl, 
        siteName, siteTitle, exploreTitle, exploreSubtitle,
        stayUpdatedTitle, stayUpdatedSubtitle, footerTitle, footerSubtitle,
        socialLinkFacebook, socialLinks, heroStatusText, heroButton1Text, heroButton1Link,
        heroButton2Text, heroButton2Link,
        splashTopLeft, splashTopRight, splashBottomLeft, splashBottomRight, splashLogs
      },
      create: { 
        id: "singleton", 
        heroTitle, heroSubtitle, tickerItems, footerText, logoUrl, 
        siteName, siteTitle, exploreTitle, exploreSubtitle,
        stayUpdatedTitle, stayUpdatedSubtitle, footerTitle, footerSubtitle,
        socialLinkFacebook, socialLinks, heroStatusText, heroButton1Text, heroButton1Link,
        heroButton2Text, heroButton2Link,
        splashTopLeft, splashTopRight, splashBottomLeft, splashBottomRight, splashLogs
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
