import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand ISR revalidation endpoint for Sanity webhooks.
 *
 * Configure a Sanity webhook to POST to:
 *   https://hallofflowers.com/api/revalidate?secret=YOUR_SECRET
 *
 * The webhook should send the document body. Based on the document type,
 * we revalidate the appropriate paths.
 */

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  // Validate secret (skip in development)
  if (REVALIDATION_SECRET && secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type, slug } = body;

    switch (_type) {
      case "page":
        // Revalidate the specific page and homepage (in case it's the homepage)
        if (slug?.current) {
          revalidatePath(`/marketing/${slug.current}`);
        }
        revalidatePath("/marketing");
        break;

      case "exhibitorPage":
        // Revalidate the exhibitor page and exhibitor homepage
        if (slug?.current) {
          revalidatePath(`/exhibitor/${slug.current}`);
        }
        revalidatePath("/exhibitor");
        break;

      case "siteSettings":
        // Site settings affect everything — revalidate root paths
        revalidatePath("/marketing");
        revalidatePath("/exhibitor");
        break;

      case "navigation":
      case "footer":
        // Nav/footer affect all pages in their site
        revalidatePath("/marketing", "layout");
        revalidatePath("/exhibitor", "layout");
        break;

      case "conference":
      case "venue":
      case "contact":
      case "participantList":
        // These can appear on many pages — revalidate broadly
        revalidatePath("/marketing");
        revalidatePath("/exhibitor");
        break;

      case "redirect":
        // Redirects are handled by middleware, but revalidate to be safe
        revalidatePath("/marketing");
        break;

      default:
        // Unknown type — revalidate everything
        revalidatePath("/marketing");
        revalidatePath("/exhibitor");
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
