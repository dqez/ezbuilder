"use client";

import { useEditor, Element } from "@craftjs/core";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className="w-full justify-start gap-3 h-10 px-3"
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
  return (
    <div className="p-2 space-y-1">
      {/* Basic Components */}
      <div className="px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Basic</span>
      </div>
      <ToolboxItem
        label="Text"
        icon={<Type className="w-4 h-4" />}
        element={
          <NodeText
            text="Edit this text"
            fontSize={16}
            color="#000000"
            textAlign="left"
          />
        }
      />
      <ToolboxItem
        label="Heading"
        icon={<Heading1 className="w-4 h-4" />}
        element={
          <NodeHeading
            text="Heading"
            level={1}
            color="#000000"
            textAlign="left"
          />
        }
      />
      <ToolboxItem
        label="Image"
        icon={<Image className="w-4 h-4" />}
        element={<NodeImage src="" alt="Image" width="100%" borderRadius={8} />}
      />
      <ToolboxItem
        label="Button"
        icon={<MousePointerClick className="w-4 h-4" />}
        element={
          <NodeButton
            text="Click me"
            url="#"
            variant="default"
            size="default"
          />
        }
      />

      <Separator className="my-3" />

      {/* Layout Components */}
      <div className="px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Layout
        </span>
      </div>
      <ToolboxItem
        label="Container"
        icon={<Square className="w-4 h-4" />}
        element={
          <Element
            canvas
            is={NodeContainer}
            padding={16}
            backgroundColor="transparent"
            flexDirection="column"
            gap={8}
          />
        }
      />
      <ToolboxItem
        label="Spacer"
        icon={<ArrowUpDown className="w-4 h-4" />}
        element={<NodeSpacer height={32} />}
      />
      <ToolboxItem
        label="Divider"
        icon={<Minus className="w-4 h-4" />}
        element={<NodeDivider color="#e5e7eb" thickness={1} margin={16} />}
      />

      <Separator className="my-3" />

      {/* Pre-built Components */}
      <div className="px-2 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Pre-built
        </span>
      </div>
      <ToolboxItem
        label="Card"
        icon={<CreditCard className="w-4 h-4" />}
        element={
          <NodeCard
            title="Card Title"
            description="Card description"
            imageUrl=""
          />
        }
      />
      <ToolboxItem
        label="Hero"
        icon={<Sparkles className="w-4 h-4" />}
        element={
          <NodeHero
            title="Build Amazing Websites"
            subtitle="Create beautiful landing pages"
            backgroundImage=""
            ctaText="Get Started"
            ctaUrl="#"
          />
        }
      />
      <ToolboxItem
        label="Navbar"
        icon={<Navigation className="w-4 h-4" />}
        element={
          <NodeNavbar
            logo="MyBrand"
            links={[
              { label: "Home", url: "#" },
              { label: "About", url: "#" },
            ]}
          />
        }
      />
      <ToolboxItem
        label="Footer"
        icon={<CircleArrowDown className="w-4 h-4" />}
        element={<NodeFooter copyright="© 2026 MyBrand" socialLinks={[]} />}
      />
      <ToolboxItem
        label="Gallery"
        icon={<LayoutGrid className="w-4 h-4" />}
        element={<NodeGallery images={[]} columns={2} gap={16} />}
      />
    </div>
  );
};
