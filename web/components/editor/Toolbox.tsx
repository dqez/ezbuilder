"use client";

import { useEditor, Element } from "@craftjs/core";
import { useState } from "react";
import {
  Type,
  Heading1,
  Image,
  MousePointerClick,
  Square,
  ArrowUpDown,
  Minus,
  CreditCard,
  Sparkles,
  Navigation,
  CircleArrowDown,
  LayoutGrid,
  TextQuote,
  Tv,
  Code,
  RectangleHorizontal,
  AlignLeft,
  List,
  CheckSquare,
  Grid,
  Columns as ColumnsIcon,
  ListCollapse,
  PanelTop,
  UserCircle2,
  BadgeDollarSign,
  Megaphone,
  BarChart3,
  ListChecks,
  Share2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NodeText } from "./components/NodeText";
import { NodeHeading } from "./components/NodeHeading";
import { NodeImage } from "./components/NodeImage";
import { NodeButton } from "./components/NodeButton";
import { NodeContainer } from "./components/NodeContainer";
import { NodeSpacer } from "./components/NodeSpacer";
import { NodeDivider } from "./components/NodeDivider";
import { NodeCard } from "./components/NodeCard";
import { NodeHero } from "./components/NodeHero";
import { NodeNavbar } from "./components/NodeNavbar";
import { NodeFooter } from "./components/NodeFooter";
import { NodeGallery } from "./components/NodeGallery";
import { NodeRichText } from "./components/NodeRichText";
import { NodeVideo } from "./components/NodeVideo";
import { NodeIcon } from "./components/NodeIcon";
import { NodeEmbed } from "./components/NodeEmbed";
import { NodeForm } from "./components/NodeForm";
import { NodeInput } from "./components/NodeInput";
import { NodeTextarea } from "./components/NodeTextarea";
import { NodeSelect } from "./components/NodeSelect";
import { NodeCheckbox } from "./components/NodeCheckbox";
import { NodeGrid } from "./components/NodeGrid";
import { NodeColumns } from "./components/NodeColumns";
import { NodeAccordion } from "./components/NodeAccordion";
import { NodeTabs } from "./components/NodeTabs";
import { NodeTestimonial } from "./components/NodeTestimonial";
import { NodePricing } from "./components/NodePricing";
import { NodeCTA } from "./components/NodeCTA";
import { NodeStats } from "./components/NodeStats";
import { NodeFeatureList } from "./components/NodeFeatureList";
import { NodeSocialIcons } from "./components/NodeSocialIcons";

interface ToolboxItemProps {
  label: string;
  icon: React.ReactNode;
  element: React.ReactElement;
}

const ToolboxItem = ({ label, icon, element }: ToolboxItemProps) => {
  const { connectors } = useEditor();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 h-10 px-3 cursor-grab"
      ref={(ref) => {
        if (ref) connectors.create(ref, element);
      }}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Button>
  );
};

export const Toolbox = () => {
  const [search, setSearch] = useState("");

  const groups = [
    {
      name: "Basic",
      items: [
        {
          label: "Text",
          icon: <Type className="w-4 h-4" />,
          element: (
            <NodeText
              text="Edit this text"
              fontSize={16}
              color="#000000"
              textAlign="left"
            />
          ),
        },
        {
          label: "Heading",
          icon: <Heading1 className="w-4 h-4" />,
          element: (
            <NodeHeading
              text="Heading"
              level={1}
              color="#000000"
              textAlign="left"
            />
          ),
        },
        {
          label: "Image",
          icon: <Image className="w-4 h-4" />,
          element: (
            <NodeImage src="" alt="Image" width="100%" borderRadius={8} />
          ),
        },
        {
          label: "Button",
          icon: <MousePointerClick className="w-4 h-4" />,
          element: (
            <NodeButton
              text="Click me"
              url="#"
              variant="default"
              size="default"
            />
          ),
        },
      ],
    },
    {
      name: "Text & Media",
      items: [
        {
          label: "Rich Text",
          icon: <TextQuote className="w-4 h-4" />,
          element: (
            <NodeRichText
              text="Edit this rich text"
              fontSize={16}
              color="#000000"
              textAlign="left"
              fontWeight={400}
            />
          ),
        },
        {
          label: "Video",
          icon: <Tv className="w-4 h-4" />,
          element: (
            <NodeVideo
              url=""
              autoplay={false}
              muted={false}
              aspectRatio="16:9"
            />
          ),
        },
        {
          label: "Icon",
          icon: <Sparkles className="w-4 h-4" />,
          element: (
            <NodeIcon
              iconName="Star"
              size={24}
              color="#000000"
              backgroundColor="transparent"
              borderRadius={0}
              padding={8}
            />
          ),
        },
        {
          label: "Embed",
          icon: <Code className="w-4 h-4" />,
          element: <NodeEmbed embedCode="" width="100%" height="400px" />,
        },
      ],
    },
    {
      name: "Forms",
      items: [
        {
          label: "Form Wrapper",
          icon: <RectangleHorizontal className="w-4 h-4" />,
          element: (
            <NodeForm
              padding={16}
              gap={16}
              backgroundColor="transparent"
              borderColor="transparent"
              borderWidth={0}
              borderRadius={0}
            />
          ),
        },
        {
          label: "Input",
          icon: <Type className="w-4 h-4" />,
          element: (
            <NodeInput
              label="Input Label"
              placeholder="Type here..."
              inputType="text"
              required={false}
              name="input"
            />
          ),
        },
        {
          label: "Textarea",
          icon: <AlignLeft className="w-4 h-4" />,
          element: (
            <NodeTextarea
              label="Message"
              placeholder="Type your message..."
              rows={4}
              required={false}
              name="message"
            />
          ),
        },
        {
          label: "Select",
          icon: <List className="w-4 h-4" />,
          element: (
            <NodeSelect
              label="Select Option"
              placeholder="Choose one..."
              options="Option 1, Option 2, Option 3"
              required={false}
              name="select"
            />
          ),
        },
        {
          label: "Checkbox",
          icon: <CheckSquare className="w-4 h-4" />,
          element: (
            <NodeCheckbox
              label="I agree"
              required={false}
              name="checkbox"
              defaultChecked={false}
            />
          ),
        },
      ],
    },
    {
      name: "Layout",
      items: [
        {
          label: "Container",
          icon: <Square className="w-4 h-4" />,
          element: (
            <Element
              canvas
              is={NodeContainer}
              padding={16}
              backgroundColor="transparent"
              flexDirection="column"
              gap={8}
            />
          ),
        },
        {
          label: "Spacer",
          icon: <ArrowUpDown className="w-4 h-4" />,
          element: <NodeSpacer height={32} />,
        },
        {
          label: "Divider",
          icon: <Minus className="w-4 h-4" />,
          element: <NodeDivider color="#e5e7eb" thickness={1} margin={16} />,
        },
        {
          label: "Grid",
          icon: <Grid className="w-4 h-4" />,
          element: (
            <NodeGrid
              columns={3}
              gap={16}
              padding={16}
              backgroundColor="transparent"
            />
          ),
        },
        {
          label: "Columns",
          icon: <ColumnsIcon className="w-4 h-4" />,
          element: (
            <NodeColumns
              columns={2}
              gap={16}
              padding={16}
              backgroundColor="transparent"
            />
          ),
        },
        {
          label: "Accordion",
          icon: <ListCollapse className="w-4 h-4" />,
          element: (
            <NodeAccordion items={["Section 1", "Section 2", "Section 3"]} />
          ),
        },
        {
          label: "Tabs",
          icon: <PanelTop className="w-4 h-4" />,
          element: (
            <NodeTabs tabs={["Tab 1", "Tab 2", "Tab 3"]} defaultValue="tab-0" />
          ),
        },
      ],
    },
    {
      name: "Marketing",
      items: [
        {
          label: "Testimonial",
          icon: <UserCircle2 className="w-4 h-4" />,
          element: (
            <NodeTestimonial
              quote="This is a testimonial"
              author="Zeq Tran"
              role="CEO"
              avatarUrl="https://avatars.githubusercontent.com/u/124875024?v=4"
            />
          ),
        },
        {
          label: "Pricing",
          icon: <BadgeDollarSign className="w-4 h-4" />,
          element: (
            <NodePricing
              title="Pro Plan"
              price="$29"
              benefits="Benefit 1, Benefit 2"
              buttonText="Buy Now"
            />
          ),
        },
        {
          label: "CTA",
          icon: <Megaphone className="w-4 h-4" />,
          element: (
            <NodeCTA
              title="Call to Action"
              subtitle="Subtitle here"
              buttonText="Click Me"
              buttonLink="#"
            />
          ),
        },
        {
          label: "Stats",
          icon: <BarChart3 className="w-4 h-4" />,
          element: <NodeStats stats="100+: Users, 99%: Satisfaction" />,
        },
        {
          label: "Features",
          icon: <ListChecks className="w-4 h-4" />,
          element: (
            <NodeFeatureList features="Feature 1: Description | Feature 2: Description" />
          ),
        },
        {
          label: "Social",
          icon: <Share2 className="w-4 h-4" />,
          element: (
            <NodeSocialIcons
              twitter="#"
              github="#"
              facebook=""
              instagram=""
              linkedin=""
              youtube=""
            />
          ),
        },
      ],
    },
    {
      name: "Pre-built",
      items: [
        {
          label: "Card",
          icon: <CreditCard className="w-4 h-4" />,
          element: (
            <NodeCard
              title="Card Title"
              description="Card description"
              imageUrl=""
            />
          ),
        },
        {
          label: "Hero",
          icon: <Sparkles className="w-4 h-4" />,
          element: (
            <NodeHero
              title="Build Amazing Websites"
              subtitle="Create beautiful landing pages"
              backgroundImage=""
              ctaText="Get Started"
              ctaUrl="#"
            />
          ),
        },
        {
          label: "Navbar",
          icon: <Navigation className="w-4 h-4" />,
          element: (
            <NodeNavbar
              logo="MyBrand"
              links={[
                { label: "Home", url: "#" },
                { label: "About", url: "#" },
              ]}
            />
          ),
        },
        {
          label: "Footer",
          icon: <CircleArrowDown className="w-4 h-4" />,
          element: <NodeFooter copyright="© 2026 MyBrand" socialLinks={[]} />,
        },
        {
          label: "Gallery",
          icon: <LayoutGrid className="w-4 h-4" />,
          element: <NodeGallery images={[]} columns={2} gap={16} />,
        },
      ],
    },
  ];

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="p-2 space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search components..."
          className="pl-8 h-9 bg-muted/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        {filteredGroups.map((group) => (
          <div key={group.name}>
            <div className="px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {group.name}
              </span>
            </div>
            {group.items.map((item) => (
              <ToolboxItem
                key={item.label}
                label={item.label}
                icon={item.icon}
                element={item.element}
              />
            ))}
            <Separator className="my-3 hidden last:block" />
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No components found
          </div>
        )}
      </div>
    </div>
  );
};
