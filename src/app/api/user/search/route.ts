// app/api/user/search/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);  // Get the URL from the request
  const name = url.searchParams.get("query") || "";  // Use searchParams.get() to get query parameters
console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSS",  url.searchParams);

  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: name, 
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(users);
}
