"use client";

import { useNode } from "@craftjs/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface NodeTestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export const NodeTestimonial = ({
  quote = "EzBuilder has transformed how we build websites. It's incredibly intuitive and powerful.",
  author = "Zeq Tran",
  role = "Product Manager",
  avatarUrl = "https://avatars.githubusercontent.com/u/124875024?v=4",
}: NodeTestimonialProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="w-full max-w-md mx-auto"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Quote className="w-8 h-8 text-muted-foreground mb-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium leading-relaxed italic text-muted-foreground">
            &quot;{quote}&quot;
          </p>
          <div className="flex items-center gap-4 pt-4 border-t">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={author} />
              <AvatarFallback>{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{author}</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

NodeTestimonial.craft = {
  displayName: "Testimonial",
  props: {
    quote:
      "EzBuilder has transformed how we build websites. It's incredibly intuitive and powerful.",
    author: "Jane Doe",
    role: "Product Manager",
    avatarUrl: "https://github.com/shadcn.png",
  },
  related: {},
};
