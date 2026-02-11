// Craft.js Resolver - Maps component names to React components
// This file exports a resolver object that Craft.js uses to serialize/deserialize the editor state

export { NodeText } from "./NodeText";
export { NodeHeading } from "./NodeHeading";
export { NodeImage } from "./NodeImage";
export { NodeButton } from "./NodeButton";
export { NodeContainer } from "./NodeContainer";
export { NodeSpacer } from "./NodeSpacer";
export { NodeDivider } from "./NodeDivider";
export { NodeCard } from "./NodeCard";
export { NodeHero } from "./NodeHero";
export { NodeNavbar } from "./NodeNavbar";
export { NodeFooter } from "./NodeFooter";
export { NodeGallery } from "./NodeGallery";
export { NodeRichText } from "./NodeRichText";
export { NodeVideo } from "./NodeVideo";
export { NodeIcon } from "./NodeIcon";
export { NodeEmbed } from "./NodeEmbed";
export { NodeForm } from "./NodeForm";
export { NodeInput } from "./NodeInput";
export { NodeTextarea } from "./NodeTextarea";
export { NodeSelect } from "./NodeSelect";
export { NodeCheckbox } from "./NodeCheckbox";
export { NodeGrid } from "./NodeGrid";
export { NodeColumns } from "./NodeColumns";
export { NodeAccordion } from "./NodeAccordion";
export { NodeTabs } from "./NodeTabs";
export { NodeTestimonial } from "./NodeTestimonial";
export { NodePricing } from "./NodePricing";
export { NodeCTA } from "./NodeCTA";
export { NodeStats } from "./NodeStats";
export { NodeFeatureList } from "./NodeFeatureList";
export { NodeSocialIcons } from "./NodeSocialIcons";

// Resolver for Craft.js Editor
import { NodeText } from "./NodeText";
import { NodeHeading } from "./NodeHeading";
import { NodeImage } from "./NodeImage";
import { NodeButton } from "./NodeButton";
import { NodeContainer } from "./NodeContainer";
import { NodeSpacer } from "./NodeSpacer";
import { NodeDivider } from "./NodeDivider";
import { NodeCard } from "./NodeCard";
import { NodeHero } from "./NodeHero";
import { NodeNavbar } from "./NodeNavbar";
import { NodeFooter } from "./NodeFooter";
import { NodeGallery } from "./NodeGallery";
import { NodeRichText } from "./NodeRichText";
import { NodeVideo } from "./NodeVideo";
import { NodeIcon } from "./NodeIcon";
import { NodeEmbed } from "./NodeEmbed";
import { NodeForm } from "./NodeForm";
import { NodeInput } from "./NodeInput";
import { NodeTextarea } from "./NodeTextarea";
import { NodeSelect } from "./NodeSelect";
import { NodeCheckbox } from "./NodeCheckbox";
import { NodeGrid } from "./NodeGrid";
import { NodeColumns } from "./NodeColumns";
import { NodeAccordion } from "./NodeAccordion";
import { NodeTabs } from "./NodeTabs";
import { NodeTestimonial } from "./NodeTestimonial";
import { NodePricing } from "./NodePricing";
import { NodeCTA } from "./NodeCTA";
import { NodeStats } from "./NodeStats";
import { NodeFeatureList } from "./NodeFeatureList";
import { NodeSocialIcons } from "./NodeSocialIcons";

export const resolver = {
  Text: NodeText,
  Heading: NodeHeading,
  Image: NodeImage,
  Button: NodeButton,
  Container: NodeContainer,
  Spacer: NodeSpacer,
  Divider: NodeDivider,
  Card: NodeCard,
  Hero: NodeHero,
  Navbar: NodeNavbar,
  Footer: NodeFooter,
  Gallery: NodeGallery,
  RichText: NodeRichText,
  Video: NodeVideo,
  Icon: NodeIcon,
  Embed: NodeEmbed,
  Form: NodeForm,
  Input: NodeInput,
  Textarea: NodeTextarea,
  Select: NodeSelect,
  Checkbox: NodeCheckbox,
  Grid: NodeGrid,
  Columns: NodeColumns,
  Accordion: NodeAccordion,
  Tabs: NodeTabs,
  Testimonial: NodeTestimonial,
  Pricing: NodePricing,
  CTA: NodeCTA,
  Stats: NodeStats,
  Features: NodeFeatureList,
  Social: NodeSocialIcons,
};
