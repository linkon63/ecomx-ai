import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  // No authentication needed for fake data approach
  return NextResponse.next();
};
