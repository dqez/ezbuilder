import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, ExternalLink, Edit } from "lucide-react";

// Mock data - in real app, fetch from API
const mockWebsites = [
  {
    id: "site-1",
    name: "Portfolio",
    subdomain: "minh",
    slug: "demo",
    updatedAt: "2026-02-08",
  },
  {
    id: "site-2",
    name: "Landing Page",
    subdomain: "mybusiness",
    slug: "demo",
    updatedAt: "2026-02-07",
  },
];

export default function DashboardPage() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Websites</h1>
          <p className="text-muted-foreground mt-1">
            Manage and edit your websites
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Website
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockWebsites.map((site) => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription>
                {site.subdomain}.ezbuilder.local • Updated {site.updatedAt}
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <Button asChild variant="default" size="sm" className="flex-1">
                <Link href={`/editor/${site.id}`}>
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/sites/${site.slug}`} target="_blank">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
