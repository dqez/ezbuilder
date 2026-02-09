import { notFound } from "next/navigation";
import { PublicRenderer } from "@/components/editor/PublicRenderer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type Page = {
  id: string;
  name: string;
  slug: string;
  content: Record<string, unknown>;
  isPublished: boolean;
  publishedAt: string | null;
  website: {
    name: string;
    subdomain: string;
  };
};

type Props = {
  params: Promise<{
    subdomain: string;
    slug: string;
  }>;
};

async function fetchPublicPage(
  subdomain: string,
  slug: string,
): Promise<Page | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/public/${subdomain}/${slug}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export default async function PublicPageView({ params }: Props) {
  const { subdomain, slug } = await params;

  const page = await fetchPublicPage(subdomain, slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{page.website.name}</h1>
            <p className="text-sm text-muted-foreground">{page.name}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <PublicRenderer content={page.content} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { subdomain, slug } = await params;
  const page = await fetchPublicPage(subdomain, slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.name} - ${page.website.name}`,
    description: `View ${page.name} on ${page.website.name}`,
  };
}
